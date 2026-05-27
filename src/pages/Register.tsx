import React, { useState } from "react";
import type { PageName } from "../App";

interface RegisterProps {
  navigate: (page: PageName) => void;
}

export default function Register({ navigate }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // ✨ HANDLE SUBMIT: Skenario Auto-Login Modern
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Kasih feedback kalau akun berhasil terbuat
    alert(`Registrasi Berhasil! Selamat datang, ${username}.`);
    
    // 2. Langsung bypass masuk ke dashboard (tanpa lempar ke halaman login dulu)
    navigate("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#2d2d2d] flex flex-col justify-center py-12 px-6 lg:px-8 font-body antialiased text-white">
      
      {/* Container Card Register */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-[#3a3a3a] p-10 rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-white/5">
        
        {/* Logo Kotak Oranye */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 bg-[#e05c2a] rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm3 12h2v-2h2v2h2v2h-2v2h-2v-2h-2v-2z" />
            </svg>
          </div>
        </div>

        {/* Judul Teks */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold tracking-tight text-white">
            Welcome to Fin Sustain
          </h2>
          <p className="mt-1 text-xs text-gray-400 font-normal">
            Registration to manage your sustainability
          </p>
          <h3 className="text-xl font-bold text-white mt-6 tracking-wide">
            Registration
          </h3>
        </div>

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Input Username */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-[#e05c2a] bg-[#4a4a4a] text-white placeholder-gray-400 transition-all"
            />
          </div>

          {/* Input Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" />
              </svg>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-[#e05c2a] bg-[#4a4a4a] text-white placeholder-gray-400 transition-all"
            />
          </div>

          {/* Opsi Tambahan */}
          <div className="flex items-center justify-between text-xs pt-1 pb-2">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/10 bg-[#4a4a4a] text-[#e05c2a] focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 accent-[#e05c2a]"
              />
              <span>Ingat saya</span>
            </label>
            <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">
              Lupa Password?
            </span>
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center font-bold text-sm py-3 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer shadow-md tracking-wide mt-2"
          >
            Daftar
          </button>
        </form>

        {/* Link ke Login */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Sudah punya akun?{" "}
          <button 
            type="button"
            onClick={() => navigate("login")}
            className="text-[#e05c2a] font-bold hover:underline bg-transparent cursor-pointer ml-0.5"
          >
            Login di sini
          </button>
        </p>

        {/* Tombol Kembali ke Beranda */}
        <div className="mt-6 text-center border-t border-white/5 pt-5">
          <button
            type="button"
            onClick={() => navigate("home")}
            className="text-xs font-bold text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5 uppercase tracking-wider"
          >
            ← Kembali ke Beranda
          </button>
        </div>

      </div>
    </div>
  );
}