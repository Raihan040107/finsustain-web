import React, { useState } from "react";
import type { PageName } from "../App";

interface LoginProps {
  navigate: (page: PageName) => void;
}

export default function Login({ navigate }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login Berhasil!");
    navigate("dashboard");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#2d2d2d] font-body antialiased text-white overflow-hidden">
      
      {/* ✨ INJEKSI ANIMASI PREMIUM (Zero Config) */}
      <style>{`
        @keyframes premiumSlideRight {
          from { transform: translateX(80px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes premiumFade {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-right {
          animation: premiumSlideRight 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: premiumFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* SISI KIRI: GAMBAR & BRANDING */}
      <div 
        className="hidden lg:flex flex-col justify-between p-12 relative bg-cover bg-center border-r border-white/5 animate-fade-in"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1582236371728-f68e0a7f1c1f?auto=format&fit=crop&w=600&q=60')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-0" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#e05c2a] rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm3 12h2v-2h2v2h2v2h-2v2h-2v-2h-2v-2z" />
            </svg>
          </div>
          <span className="font-head text-sm font-bold tracking-wider uppercase text-white">Fin Sustain</span>
        </div>

        <div className="relative z-10 max-w-md mb-8">
          <h1 className="font-head text-3xl md:text-4xl font-black text-white italic leading-tight mb-4">
            "Wariskan Alam, Tumbuhkan Kekayaan."
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed">
            Platform keuangan hijau pertama di Indonesia. Investasi, donasi, dan kelola keuangan Anda secara berkelanjutan.
          </p>
        </div>
      </div>

      {/* SISI KANAN: FORM CARD (Menggunakan efek slide masuk dari kanan) */}
      <div className="flex items-center justify-center py-12 px-6 lg:px-8 bg-[#2d2d2d]">
        <div className="w-full max-w-md bg-[#3a3a3a] p-10 rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-white/5 data-side animate-slide-right">
          
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 bg-[#e05c2a] rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm3 12h2v-2h2v2h2v2h-2v2h-2v-2h-2v-2z" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-lg font-bold tracking-tight text-white">
              Welcome to Fin Sustain
            </h2>
            <p className="mt-1 text-xs text-gray-400 font-normal">
              Registration to manage your sustainability
            </p>
            <h3 className="text-xl font-bold text-white mt-6 tracking-wide">
              Login
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username / Email"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-[#e05c2a] bg-[#4a4a4a] text-white placeholder-gray-400 transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
              <span className="text-gray-400 hover:text-white cursor-pointer transition-colors hover:underline">
                Lupa Password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center font-bold text-sm py-3 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer shadow-md tracking-wide mt-2"
            >
              Login
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-400">
            Belum punya akun?{" "}
            <button 
              type="button"
              onClick={() => navigate("register")}
              className="text-[#e05c2a] font-bold hover:underline bg-transparent cursor-pointer"
            >
              Daftar akun
            </button>
          </p>

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

    </div>
  );
}