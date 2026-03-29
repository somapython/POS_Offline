const electron = require('electron');
const { app, BrowserWindow, ipcMain, session, globalShortcut } = electron;
const path = require("path");
const db = require("./db");
let win;
var mainWindow = null;
var splash = null;
var closeApp = false;
const version = app.getVersion();
// require('@electron/remote/main').initialize();

const isDev = !app.isPackaged;
function createWindow() {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    frame: false,
    // show: false,
    center: false,
    minWidth: 0,
    minHeight: 0,
    width: 0,
    height: 0,
    resizable: true,
    title: "POS System",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
      enableRemoteModule: true,
      webviewTag: true,
    },
  });

  if (isDev) {
    // win.loadURL("http://localhost:5173", {
    //   userAgent: "electron"
    // });
    // win.webContents.openDevTools(); // 👈 ADD THIS
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
   win.once('ready-to-show', () => {
      win.show();
      win.webContents.openDevTools({ "detach": false });
      // win.webContents.send('getDownloadsFolder', app.getPath('downloads'));
      // win.webContents.send('getTempFolder', app.getPath('temp'));
      win.setBounds({ x: 0, y: 0, width: width, height: height });
      win.setMinimumSize(width, height);
      win.maximize();

      if (splash) {
        splash.destroy(); 
      }

    });
}
let loadingInterval;

function sendProgress() {
  let percent = 0;

  loadingInterval = setInterval(() => {
    percent += 10;

    if (splash && splash.webContents) {
      splash.webContents.send("loading-progress", percent);
    }

    if (percent >= 100) {
      clearInterval(loadingInterval);
    }
  }, 300);
}

app.whenReady().then(() => {
  initTrial();
  splash = new BrowserWindow({ 
    width: 400, 
    height: 450, 
    show: false, 
    frame: false, 
    backgroundColor: "#fff", 
    resizable: false, 
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,      
      contextIsolation: false     
    }
  });
  splash.loadFile(path.join(__dirname, 'loader.html'));

  splash.webContents.on("did-finish-load", () => {
    splash.show();
    splash.webContents.send("app-version", version);
    splash.webContents.send("license-status", checkLicense());
    sendProgress();
    createWindow();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

const fs = require("fs");

function saveLicense(data) {
  const licensePath = path.join(app.getPath("userData"), "license.json");
  fs.writeFileSync(licensePath, JSON.stringify(data));
}

function initTrial() {
  const fs = require("fs");
  const trialPath = path.join(app.getPath("userData"), "trial.json");

  if (!fs.existsSync(trialPath)) {
    const start = new Date();
    const expiry = new Date();
    expiry.setDate(start.getDate() + 30);

    fs.writeFileSync(trialPath, JSON.stringify({
      start,
      expiry
    }));
  }
}
function checkLicense() {
  const fs = require("fs");

  const licensePath = path.join(app.getPath("userData"), "license.json");
  const trialPath = path.join(app.getPath("userData"), "trial.json");

  // ✅ LICENSE
  if (fs.existsSync(licensePath)) {
    const data = JSON.parse(fs.readFileSync(licensePath));
    if (new Date() > new Date(data.expiry)) return "expired";
    return "valid";
  }

  // ✅ TRIAL
  if (fs.existsSync(trialPath)) {
    const trial = JSON.parse(fs.readFileSync(trialPath));
    if (new Date() > new Date(trial.expiry)) return "expired";
    return "trial";
  }

  return "trial";
}

// IPC
ipcMain.handle("activate-license", (event, key) => {
  if (key === "ZYGAL-12345") { // your logic
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);

    saveLicense({
      key,
      expiry
    });

    return { success: true };
  }

  return { success: false };
});


// ipcMain.handle("add-product", (e, p) => {
//   db.prepare(`
//     INSERT INTO products (name, price, stock)
//     VALUES (?, ?, ?)
//   `).run(JSON.stringify(p.name), p.price, p.quantity);
// });

ipcMain.handle("get-products", () => {
  return db.prepare("SELECT * FROM products").all();
});

// ipcMain.handle("update-product", (e, p) => {
//   db.prepare(`
//     UPDATE products
//     SET name=?, price=?, stock=?
//     WHERE id=?
//   `).run(JSON.stringify(p.name), p.price, p.quantity, p.id);
// });

ipcMain.handle("delete-product", (e, id) => {
  db.prepare("DELETE FROM products WHERE id=?").run(id);
});

// Register
ipcMain.handle("register-user", (event, user) => {
  const exists = db.prepare(
    "SELECT * FROM users WHERE phone = ? OR email = ?"
  ).get(user.phone, user.email);

  if (exists) return { success: false, message: "User already exists" };

  db.prepare(`
    INSERT INTO users (name, phone, email, address, password, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    user.name,
    user.phone,
    user.email,
    user.address,
    user.password,
    user.role
  );

  return { success: true };
});

// Login
ipcMain.handle("login-user", (event, data) => {
  const user = db.prepare(
    "SELECT * FROM users WHERE (phone = ? OR email = ?) AND password = ?"
  ).get(data.login, data.login, data.password);

  if (!user) return { success: false };

  return { success: true, user };
});

ipcMain.handle("create-sales", (event, sale) => {
  const insertSale = db.prepare(
    "INSERT INTO sales (total, date) VALUES (?, ?)"
  );

  const updateStock = db.prepare(
    "UPDATE products SET stock = stock - ? WHERE id = ?"
  );

  const transaction = db.transaction((sale) => {
    insertSale.run(sale.total, new Date().toISOString());

    sale.items.forEach(item => {
      updateStock.run(item.qty, item.id);
    });
  });

  transaction(sale);
});

ipcMain.handle("create-sale", (event, sale) => {
  const insertSale = db.prepare(
    "INSERT INTO sales (total, date) VALUES (?, ?)"
  );

  const insertItem = db.prepare(
    "INSERT INTO sale_items (sale_id, product_id, qty, price) VALUES (?, ?, ?, ?)"
  );

  const transaction = db.transaction((sale) => {
    const result = insertSale.run(
      sale.total,
      new Date().toISOString()
    );

    const saleId = result.lastInsertRowid;

    sale.items.forEach((item) => {
      insertItem.run(saleId, item.id, item.qty, item.price);

      db.prepare(
        "UPDATE products SET stock = stock - ? WHERE id = ?"
      ).run(item.qty, item.id);
    });
  });

  transaction(sale);

  return { success: true };
});

ipcMain.handle("get-dashboard-data", () => {
  const totalSales = db.prepare(
    "SELECT SUM(total) as total FROM sales"
  ).get();

  const today = new Date().toISOString().split("T")[0];

  const todaysSales = db.prepare(
    "SELECT SUM(total) as total FROM sales WHERE date LIKE ?"
  ).get(`${today}%`);

  const totalTransactions = db.prepare(
    "SELECT COUNT(*) as count FROM sales"
  ).get();

  const totalProducts = db.prepare(
    "SELECT COUNT(*) as count FROM products"
  ).get();

  return {
    totalSales: totalSales.total || 0,
    todaysSales: todaysSales.total || 0,
    totalTransactions: totalTransactions.count,
    totalProducts: totalProducts.count,
  };
});