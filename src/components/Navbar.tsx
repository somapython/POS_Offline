import React from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import { langData, LangKey } from "../utils/lang";

type NavbarProps = {
  user: any;
  setUser: (user: any) => void;
  dark: boolean;
  setDark: (val: boolean) => void;
  lang: LangKey; 
  setLang: (val: LangKey) => void;
};


export default function Navbar({
  user,
  setUser,
  dark,
  setDark,
  lang,
  setLang,
}: NavbarProps) {
  const t = langData[lang];

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div
      className={`px-6 py-3 flex justify-between items-center shadow ${
        dark ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* 🔹 LEFT (User Card) */}
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-xl shadow-sm ${
          dark ? "bg-gray-800" : "bg-blue-50"
        }`}
      >
        {/* Avatar */}
        <div
          className={`p-2 rounded-full ${
            dark ? "bg-gray-700" : "bg-blue-200"
          }`}
        >
          <FiUser className="text-lg" />
        </div>

        {/* User Info */}
        <div className="flex flex-col">
          <span className="text-xs opacity-70">
            {t?.welcome || "Welcome"}
          </span>
          <span className="font-semibold text-sm">
            {user?.name || "Admin"}
          </span>
        </div>
      </div>

      {/* 🔹 RIGHT CONTROLS */}
      <div className="flex items-center gap-3">
        {/* 🌐 Language */}
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as LangKey)}
          className={`px-2 py-1 rounded border ${
            dark ? "bg-gray-800 text-white" : "bg-gray-100"
          }`}
        >
          <option value="en">EN</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
        </select>

        {/* 🌙 Theme Toggle */}
        <button
          onClick={() => setDark(!dark)}
          className={`px-3 py-1 rounded ${
            dark ? "bg-gray-700" : "bg-gray-200"
          }`}
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* 🚪 Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow hover:scale-105"
        >
          <FiLogOut />
          {t?.logout || "Logout"}
        </button>
      </div>
    </div>
  );
}