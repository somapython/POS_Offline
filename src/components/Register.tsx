import React, { useState } from "react";
import { toast } from "react-hot-toast/headless";
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin } from "react-icons/fi";
import { Toaster } from "react-hot-toast";

declare global {
  interface Window {
    api: any;
  }
}

export default function Register({ setPage }: any) {
  const [form, setForm] = useState<any>({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    role: "shop",
  });

  const handleRegister = async () => {
    const res = await window.api.registerUser(form);
    console.log(res);

    if (res.success) {
      toast.success("Registered successfully");
      setPage("Login");
    } else {
      toast.error(res.message);
    }
  };

  const inputStyle =
    "w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-900 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <div className="space-y-3">
          <div className="relative">
            <FiUser className="absolute left-3 top-3 text-gray-400" />
            <input className={inputStyle} placeholder="Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}/>
          </div>

          <div className="relative">
            <FiPhone className="absolute left-3 top-3 text-gray-400" />
            <input className={inputStyle} placeholder="Phone"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}/>
          </div>

          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-gray-400" />
            <input className={inputStyle} placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}/>
          </div>

          <div className="relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-400" />
            <input className={inputStyle} placeholder="Address"
              onChange={(e) => setForm({ ...form, address: e.target.value })}/>
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />
            <input type="password" className={inputStyle} placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}/>
          </div>

          <select
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="shop">Shop</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={handleRegister}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Register
          </button>

          <p className="text-center text-sm">
            Already have account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setPage("Login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}