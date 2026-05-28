import React, { useState } from "react";
import type { PageName } from "../App";
import Toast, { type ToastType } from "../components/ui/Toast";

interface RegisterProps {
  navigate: (page: PageName) => void;
}

export default function Register({ navigate }: RegisterProps) {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // ✨ STATE UNTUK TOAST NOTIFICATION
  const [toast, setToast] = useState<{ show: boolean; message: string; type: ToastType }>({
    show: false,
    message: "",
    type: "success",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Munculin Toast
    setToast({
      show: true,
      message: `Registrasi Berhasil! Selamat datang, ${namaLengkap}.`,
      type: "success"
    });

    // Kasih jeda 1.5 detik biar user bisa baca Toast-nya sebelum dilempar ke Dashboard
    setTimeout(() => {
      navigate("dashboard");
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#2d2d2d] font-body antialiased text-white h-screen relative">
      
      {/* ✨ RENDER TOAST DI SINI */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(prev => ({ ...prev, show: false }))} 
        />
      )}

      {/* SISI KIRI: FORM CARD UTAMA */}
      <div className="flex items-center justify-center py-12 px-6 lg:px-8 bg-[#2d2d2d] order-last lg:order-first">
        <div className="w-full max-w-md bg-[#3a3a3a] p-10 rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-white/5">
          
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 bg-[#e05c2a] rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm3 12h2v-2h2v2h2v2h-2v2h-2v-2h-2v-2z" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-lg font-bold tracking-tight text-white">
              Selamat Datang di F-Tech Solution
            </h2>
            <p className="mt-1 text-xs text-gray-400 font-normal">
              Daftar untuk mulai mengelola portofolio keberlanjutan Anda
            </p>
            <h3 className="text-xl font-bold text-white mt-6 tracking-wide">
              Registrasi
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              <input
                type="text"
                required
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Nama Lengkap"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-[#e05c2a] bg-[#4a4a4a] text-white placeholder-gray-400 transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 4.5h15v15h-15v-15z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4.5 7.5l7.5 5 7.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-[#e05c2a] bg-[#4a4a4a] text-white placeholder-gray-400 transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 0c1.7 0 3 1.3 3 3v2h-6v-2c0-1.7 1.3-3 3-3zm-4 5h8v5H8v-5z" />
                </svg>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata Sandi"
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
                <span>Saya menyetujui Syarat & Ketentuan</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center font-bold text-sm py-3 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer shadow-md tracking-wide mt-2"
            >
              Daftar Sekarang
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Sudah mendaftarkan usaha Anda?{" "}
            <button 
              type="button"
              onClick={() => navigate("login")}
              className="text-[#e05c2a] font-bold hover:underline bg-transparent cursor-pointer ml-0.5"
            >
              Login di sini
            </button>
          </p>

          <div className="mt-6 text-center border-t border-white/5 pt-5 overflow-hidden">
            <button
              type="button"
              onClick={() => navigate("home")}
              className="text-xs font-bold text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5 uppercase tracking-wider group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Kembali ke Beranda
            </button>
          </div>

        </div>
      </div>

      {/* SISI KANAN: GAMBAR & BRANDING */}
      <div 
        className="hidden lg:flex flex-col justify-between p-12 relative bg-cover bg-center border-l border-white/5 order-first lg:order-last"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-[#2d2d2d]/40 z-0" />

          <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#e05c2a] rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm3 12h2v-2h2v2h2v2h-2v2h-2v-2h-2v-2z" />
            </svg>
          </div>
          <span className="font-head text-sm font-bold tracking-wider uppercase text-white">F-Tech Solution</span>
        </div>

        <div className="relative z-10 max-w-md mb-8">
          <h1 className="font-head text-3xl md:text-4xl font-black text-white italic leading-tight mb-4">
            "Satu Langkah Kecil, Dampak Besar Berkelanjutan."
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed">
            Bergabung bersama ribuan pelaku usaha yang mengedepankan transparansi lingkungan berbasis standarisasi ESG dan teknologi ramah bumi.
          </p>
        </div>
      </div>

    </div>
  );
}