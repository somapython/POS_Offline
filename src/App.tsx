import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Inventory from "./components/Inventory";
import Checkout from "./components/Checkout";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import Login from "./components/Login";
import Register from "./components/Register";
import { Toaster } from "react-hot-toast";
import { LangKey } from "./utils/lang";

declare global {
  interface Window {
    api: any;
  }
}

function App() {
  const [page, setPage] = useState("dashboard");
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [authPage, setAuthPage] = useState("Login");
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<LangKey>("en");
  const [sidebarOpen, setSidebarOpen] = useState(true);


  const loadProducts = async () => {
    const data = await window.api.getProducts();
    setProducts(data);
  };

  const addProduct = async (name: string, price: string, stock: string) => {
    await window.api.addProduct({
      name,
      price: Number(price),
      stock: Number(stock),
    });
    loadProducts();
  };

  const addToCart = (product: any) => {
    const existing = cart.find(p => p.id === product.id);

    if (existing) {
      setCart(cart.map(p =>
        p.id === product.id ? { ...p, qty: p.qty + 1 } : p
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

 useEffect(() => {
  const saved = localStorage.getItem("user");
  if (saved) {
    setUser(JSON.parse(saved));
  }
}, []);

useEffect(() => {
  if (user) {
    loadProducts();
  }
}, [user]);

  const renderPage = () => {
    switch (page) {
      case "inventory":
        return <Inventory products={products} addProduct={addProduct} addToCart={addToCart}  dark={dark}
            lang={lang} />;
      case "checkout":
        return <Checkout
            cart={cart}
            setCart={setCart}
            dark={dark}
            lang={lang}
          />;
      case "reports":
        return <Reports  dark={dark}
            lang={lang}/>;
      case "settings":
        return <Settings  dark={dark}
            lang={lang}/>;
      default:
        return <Dashboard dark={dark} lang={lang} />;
    }
  };

    if (!user) {
    return authPage === "Login"
      ? <Login setUser={setUser} setPage={setAuthPage} />
      : <Register setPage={setAuthPage} />;
  }

  return (
    <div className="flex">
      <Toaster position="top-right" />
      <Sidebar sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setPage={setPage}
        page={page}
        dark={dark}
        lang={lang} />

      <div className="flex-1">
        <Navbar user={user} setUser={setUser} dark={dark} setDark={setDark} setLang={setLang} lang={lang} />

        <div className="p-6">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;