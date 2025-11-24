import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate()
   function handleLogin() {
        navigate('/layout/upload')
    }
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#2E5868] via-[#4C6FA0] to-[#3C84D3] overflow-hidden relative">

      {/* GRID PATTERN RIGHT */}
      <div className="absolute right-10 top-1/3 opacity-30">
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-6 h-6 border border-white/20 rounded-sm"></div>
          ))}
        </div>
      </div>

      {/* TOP LEFT CORNER LOGO */}
      <div className="absolute top-8 left-10 flex items-center gap-2 text-white font-semibold text-lg">
        <span className="text-white/80">Aiinhome |</span> 
        <span className="font-bold">IG</span>
      </div>

      {/* CENTER LOGIN CARD */}
      <div className="flex flex-col items-center">
        
        {/* Logo Placeholder */}
        <div className="w-16 h-16 mb-1"></div>

        <h1 className="text-white text-3xl font-semibold">InsightGrid</h1>
        <p className="text-white/80 text-sm mt-1">
          Customize Every View. Empower Every Decision.
        </p>

        {/* INPUTS */}
        <div className="mt-8 w-80 flex flex-col space-y-4">
          <input
            type="text"
            placeholder="User Name"
            className="w-full px-4 py-2 rounded-md bg-transparent border border-white/40 text-white outline-none placeholder-white/60"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md bg-transparent border border-white/40 text-white outline-none placeholder-white/60"
          />

          {/* Login Button */}
          <button onClick={handleLogin} className="w-full py-2 rounded-md bg-white/40 text-white font-medium hover:bg-white/60 transition">
            Login
          </button>
        </div>

      
        <p className="text-white/70 text-xs mt-40">
          ©2025 Aiihome Technologies Pvt. Ltd. All rights reserved
        </p>
      </div>
    </div>
  );
}
