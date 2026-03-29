import React from "react";
import {
  FiShoppingCart,
  FiHome,
  FiPackage,
  FiBarChart2,
  FiSettings,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { langData, LangKey } from "../utils/lang";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  setPage: (page: string) => void;
  page: string;
  dark: boolean;
  lang: LangKey;
};

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  setPage,
  page,
  dark,
  lang,
}: SidebarProps) {
  const t = langData[lang];

  const navItems = [
    { key: "dashboard", label: t?.dashboard || "Dashboard", icon: <FiHome /> },
    { key: "checkout", label: t?.checkout || "Checkout", icon: <FiShoppingCart /> },
    { key: "inventory", label: t?.inventory || "Inventory", icon: <FiPackage /> },
    { key: "reports", label: t?.reports || "Reports", icon: <FiBarChart2 /> },
    { key: "settings", label: t?.settings || "Settings", icon: <FiSettings /> },
  ];

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } ${
        dark
          ? "from-gray-900 to-gray-800"
          : "from-blue-900 to-blue-700"
      } bg-gradient-to-b text-white transition-all duration-300 shadow-xl min-h-screen`}
    >
      {/* LOGO */}
      <div className="p-5 flex items-center justify-between">
        <div
          className={`flex items-center gap-3 ${
            !sidebarOpen && "justify-center w-full"
          }`}
        >
          <FiShoppingCart className="text-3xl" />
          {sidebarOpen && (
            <h1 className="text-xl font-bold tracking-wide">POS</h1>
          )}
        </div>

        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <FiX />
          </button>
        )}
      </div>

      {/* COLLAPSE BUTTON */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-full p-3 hover:bg-white/20 transition flex justify-center"
        >
          <FiMenu />
        </button>
      )}

      {/* NAV ITEMS */}
      <nav className="mt-2 space-y-2 px-3">
        {navItems.map((item) => {
          const isActive =
            page.toLowerCase() === item.key.toLowerCase();

          return (
            <div
              key={item.key}
              onClick={() => setPage(item.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${
                isActive
                  ? "bg-white text-blue-700 font-semibold shadow"
                  : "hover:bg-white/20"
              }`}
            >
              <span className="text-xl">{item.icon}</span>

              {sidebarOpen && <span>{item.label}</span>}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}