const { contextBridge, ipcRenderer } = require("electron");

console.log("✅ Preload loaded");

contextBridge.exposeInMainWorld("api", {
  activateLicense: (key) =>ipcRenderer.invoke("activate-license", key),

  addProduct: (data) => ipcRenderer.invoke("add-product", data),
  getProducts: () => ipcRenderer.invoke("get-products"),
  updateProduct: (data) => ipcRenderer.invoke("update-product", data),
  deleteProduct: (id) => ipcRenderer.invoke("delete-product", id),

  registerUser: (data) => ipcRenderer.invoke("register-user", data),
  loginUser: (data) => ipcRenderer.invoke("login-user", data),

  getDashboardData: () => ipcRenderer.invoke("get-dashboard-data"),
  createSale: (data) => ipcRenderer.invoke("create-sale", data),
});