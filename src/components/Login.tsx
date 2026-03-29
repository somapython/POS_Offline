import React, { useState } from "react";
import { FiMail, FiLock, FiSmartphone, FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

declare global {
  interface Window {
    api: any;
  }
}

export default function Login({ setUser,setPage }: any) {
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!login || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await window.api.loginUser({
        login,
        password,
      });

      if (res.success) {
        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
        toast.success("Login successful");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center py-8">
          <div className="flex justify-center mb-3">
            <FiShoppingCart className="text-4xl" />
          </div>
          <h1 className="text-2xl font-bold">POS System</h1>
          <p className="text-sm opacity-80">Point of Sale Software</p>
        </div>

        {/* TOGGLE */}
        <div className="flex border-b">
          <button
            onClick={() => setIsPhoneLogin(false)}
            className={`flex-1 py-2 flex items-center justify-center gap-2 ${
              !isPhoneLogin ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            <FiMail /> Email
          </button>

          <button
            onClick={() => setIsPhoneLogin(true)}
            className={`flex-1 py-2 flex items-center justify-center gap-2 ${
              isPhoneLogin ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            <FiSmartphone /> Phone
          </button>
        </div>

        {/* FORM */}
        <div className="p-6">
          <div className="mb-4 relative">
            {isPhoneLogin ? (
              <FiSmartphone className="absolute left-3 top-3 text-gray-400" />
            ) : (
              <FiMail className="absolute left-3 top-3 text-gray-400" />
            )}

            <input
              type="text"
              placeholder={isPhoneLogin ? "Phone Number" : "Email"}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="mb-4 relative">
            <FiLock className="absolute left-3 top-3 text-gray-400" />

            <input
              type="password"
              placeholder={isPhoneLogin ? "PIN" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* REGISTER LINK */}
          <p className="text-center mt-4 text-gray-600">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setPage("Register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}