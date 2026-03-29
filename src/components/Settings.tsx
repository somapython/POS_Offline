import React, { useState, useEffect } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiGlobe,
  FiDollarSign,
  FiClock,
  FiSave,
  FiEdit2,
  FiKey,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { langData, LangKey } from "../utils/lang";

type Props = {
  dark: boolean;
  lang: LangKey;
};

type SettingsType = {
  storeName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  currency: string;
  taxRate: string;
  businessHours: string;
};

export default function Settings({ dark, lang }: Props) {
  const t = langData[lang];

  // 🔐 LICENSE
  const [licenseStatus, setLicenseStatus] = useState("Checking...");
  const [key, setKey] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [gstNumber, setGstNumber] = useState("");
  const [printer, setPrinter] = useState("80mm");

  // 📦 SETTINGS
  const [storeSettings, setStoreSettings] = useState<SettingsType>(() => {
    const saved = localStorage.getItem("pos_settings");
    return saved
      ? JSON.parse(saved)
      : {
          storeName: "My POS Store",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "India",
          phone: "",
          email: "",
          website: "",
          currency: "INR",
          taxRate: "18",
          businessHours: "09:00 AM - 09:00 PM",
        };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState(storeSettings);

  const settings = isEditing ? tempSettings : storeSettings;

  // 🔥 LOAD LICENSE
  useEffect(() => {
    loadLicense();
  }, []);

  const loadLicense = async () => {
    const res = await window.api.getLicenseStatus?.();

    if (res === "valid") setLicenseStatus("Active");
    else if (res === "expired") setLicenseStatus("Expired");
    else setLicenseStatus("Trial");
  };

  const activate = async () => {
    const res = await window.api.activateLicense(key);

    if (res.success) {
      setLicenseStatus("Active");
      toast.success("License Activated");
    } else {
      toast.error("Invalid License");
    }
  };

  const handleInputChange = (field: keyof SettingsType, value: string) => {
    setTempSettings({
      ...tempSettings,
      [field]: value,
    });
  };

  const handleSave = () => {
    setStoreSettings(tempSettings);
    localStorage.setItem("pos_settings", JSON.stringify(tempSettings));
    setIsEditing(false);
    toast.success("Saved");
  };

  const handleCancel = () => {
    setTempSettings(storeSettings);
    setIsEditing(false);
  };

  return (
    <div
      className={`p-6 max-w-5xl mx-auto ${
        dark ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <Toaster />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t.settings}</h1>
          <p className="opacity-70">{t.manageStore}</p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FiEdit2 />
          {isEditing ? t.cancel : t.edit}
        </button>
      </div>


     {/* 🔐 LICENSE */}
      <div
        className={`p-6 rounded-2xl shadow-lg mb-6 transition ${
          dark ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiKey className="text-blue-500" />
              {t.license}
            </h2>

            {/* STATUS BADGE */}
            <span
              className={`px-3 py-1 text-xs rounded-full font-semibold ${
                licenseStatus === "Active"
                  ? "bg-green-100 text-green-600"
                  : licenseStatus === "Trial"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {licenseStatus}
            </span>
          </div>

              {/* STATUS ROW */}
              <div className="flex items-center gap-3 mb-4">
                {licenseStatus === "Active" ? (
                  <FiCheckCircle className="text-green-500 text-xl animate-pulse" />
                ) : (
                  <FiAlertCircle className="text-red-500 text-xl animate-bounce" />
                )}

                <div className="text-sm">
                  {licenseStatus === "Active" && "Your license is active"}
                  {licenseStatus === "Trial" && "You are using trial version"}
                  {licenseStatus === "Expired" && "Your license has expired"}
                </div>
              </div>

              {/* INPUT */}
              <div className="flex gap-2">
                <input
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder={t.enterKey}
                  className={`flex-1 p-2 rounded border ${
                    dark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                />

                <button
                  onClick={activate}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 rounded transition"
                >
                  {t.activate}
                </button>
              </div>

            {/* INFO */}
            <div className="mt-4 text-sm opacity-80 space-y-1">
              {licenseStatus === "Active" && (
                <p className="text-green-500">✅ Valid till: 1 Year</p>
              )}
              {licenseStatus === "Trial" && (
                <p className="text-yellow-500">⚡ Trial: 30 Days</p>
              )}
              {licenseStatus === "Expired" && (
                <p className="text-red-500">❌ License Expired</p>
              )}
            </div>
          </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* STORE INFO */}
        <div className="relative group p-5 rounded-2xl shadow-lg transition hover:shadow-2xl bg-white dark:bg-gray-800">
          
          {/* EDIT ICON */}
          <FiEdit2 className="absolute top-4 right-4 cursor-pointer opacity-70 hover:opacity-100" onClick={() => setIsEditing(!isEditing)}/>

          {/* HEADER */}
          <h2 className="text-xl font-bold mb-4 flex gap-2 items-center border-b pb-2">
            <FiGlobe className="text-blue-500" /> {t.shopInfo}
          </h2>

          <input value={settings.storeName} disabled={!isEditing} onChange={(e) => handleInputChange("storeName", e.target.value)} className="input-field mb-3" />
          <input value={settings.email} disabled={!isEditing} onChange={(e) => handleInputChange("email", e.target.value)} className="input-field mb-3" />
          <input value={settings.website} disabled={!isEditing} onChange={(e) => handleInputChange("website", e.target.value)} className="input-field" />
        {/* SAVE */}
      {isEditing && (
        <div className="fixed bottom-6 right-6 flex gap-3">
          <button onClick={handleCancel} className="btn-secondary">
            {t.cancel}
          </button>

          <button
            onClick={handleSave}
            className="btn-primary flex items-center gap-2"
          >
            <FiSave /> {t.save}
          </button>
        </div>
      )}
        </div>


          {/* LOGO */}
          <div className="relative p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">🖼️ Store Logo</h2>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => setLogo(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />

            {logo && (
              <img
                src={logo}
                alt="logo"
                className="mt-4 h-20 rounded-xl shadow-lg border hover:scale-105 transition"
              />
            )}
          </div>


          {/* GST */}
          <div className="relative p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">🧾 GST & Invoice</h2>

            <input value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} placeholder="GST Number" className="input-field mb-3" />

            <select className="input-field">
              <option>GST Inclusive</option>
              <option>GST Exclusive</option>
            </select>
          </div>


          {/* PRINTER */}
          <div className="relative p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">🖨️ Printer</h2>

            <select value={printer} onChange={(e) => setPrinter(e.target.value)} className="input-field">
              <option value="80mm">Thermal 80mm</option>
              <option value="58mm">Thermal 58mm</option>
            </select>
          </div>


          {/* BACKUP */}
          <div className="relative p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">💾 Backup</h2>

            <button
              onClick={() => {
                const data = localStorage.getItem("pos_settings");
                const blob = new Blob([data || ""], { type: "application/json" });
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = "Backup.json";
                a.click();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Download Backup
            </button>
          </div>


          {/* LOCATION */}
          <div className="relative p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 flex gap-2 items-center border-b pb-2">
              <FiMapPin className="text-red-500" /> {t.location}
            </h2>

            <input value={settings.address} disabled={!isEditing} onChange={(e) => handleInputChange("address", e.target.value)} className="input-field mb-3" />
            <input value={settings.city} disabled={!isEditing} onChange={(e) => handleInputChange("city", e.target.value)} className="input-field mb-3" />
            <input value={settings.state} disabled={!isEditing} onChange={(e) => handleInputChange("state", e.target.value)} className="input-field" />
          </div>


          {/* FINANCIAL */}
          <div className="relative p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 flex gap-2 items-center border-b pb-2">
              <FiDollarSign className="text-green-500" /> {t.financial}
            </h2>

            <select value={settings.currency} disabled={!isEditing} onChange={(e) => handleInputChange("currency", e.target.value)} className="input-field mb-3">
              <option>INR</option>
              <option>USD</option>
              <option>EUR</option>
            </select>

            <input value={settings.taxRate} disabled={!isEditing} onChange={(e) => handleInputChange("taxRate", e.target.value)} className="input-field" />
          </div>


          {/* SYSTEM */}
          <div className="relative p-5 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">{t.system}</h2>

            <p className="text-sm opacity-80">Version: 1.0.0</p>
            <p className="text-sm opacity-80">Database: SQLite</p>
            <p className="text-sm text-green-500">Status: Connected</p>
          </div>

        </div>

      
    </div>
  );
}