import React, { useState } from "react";
import type { PageName } from "../App";

interface TambahUsahaProps {
  navigate: (page: PageName) => void;
}

export default function TambahUsaha({ navigate }: TambahUsahaProps) {
  const [ktpName, setKtpName] = useState("");
  const [npwpName, setNpwpName] = useState("");
  const [izinName, setIzinName] = useState("");

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ktpName || !npwpName || !izinName) {
      alert("Silakan unggah semua dokumen terlebih dahulu (KTP, NPWP, dan Surat Izin)!");
      return;
    }
    navigate("step1");
  };

  return (
    <div className="min-h-screen bg-[#2d2d2d] flex flex-col justify-center py-12 px-6 lg:px-8 font-body antialiased text-white">
      
      {/* Container Card Tengah */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-[#3a3a3a] p-10 rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-white/5">
        
        {/* BIARKAN RATA TENGAH (text-center) sesuai request lu */}
        <div className="text-center mb-8">
          <h2 className="font-head text-[1.65rem] font-black tracking-tight text-white leading-tight">
            Unggah Dokumen
          </h2>
          <p className="mt-2 text-xs text-gray-400 font-medium tracking-wide">
            Lengkapi berkas finansial atau legalitas operasional Anda
          </p>
        </div>

        {/* Form Upload Berkas (Isinya Rata Kiri) */}
        <form onSubmit={handleNextStep} className="space-y-5">
          
          {/* 1. Slot Unggah KTP -> Rata Kiri */}
          <div className="text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              KTP
            </label>
            <div 
              onClick={() => setKtpName("KTP_Pemilik_Usaha.pdf")}
              className="border border-dashed border-white/10 hover:border-[#e05c2a] rounded-xl p-4 cursor-pointer transition-all bg-[#4a4a4a] flex items-center gap-4 justify-start"
            >
              <span className="text-xl pl-2">🪪</span>
              <div className="text-left truncate">
                <span className="block text-xs font-bold text-gray-200">
                  {ktpName ? ktpName : "Pilih / Ambil Berkas KTP"}
                </span>
                <span className="text-[10px] text-gray-400 font-medium block mt-0.5">
                  Format PDF / JPG maks 5MB
                </span>
              </div>
            </div>
          </div>

          {/* 2. Slot Unggah NPWP -> Rata Kiri */}
          <div className="text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              NPWP BADAN / PERORANGAN
            </label>
            <div 
              onClick={() => setNpwpName("NPWP_Usaha_Active.pdf")}
              className="border border-dashed border-white/10 hover:border-[#e05c2a] rounded-xl p-4 cursor-pointer transition-all bg-[#4a4a4a] flex items-center gap-4 justify-start"
            >
              <span className="text-xl pl-2">💳</span>
              <div className="text-left truncate">
                <span className="block text-xs font-bold text-gray-200">
                  {npwpName ? npwpName : "Pilih / Ambil Berkas NPWP"}
                </span>
                <span className="text-[10px] text-gray-400 font-medium block mt-0.5">
                  Format PDF / PNG maks 5MB
                </span>
              </div>
            </div>
          </div>

          {/* 3. Slot Unggah Surat Izin Usaha -> Rata Kiri */}
          <div className="text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              SURAT IZIN USAHA (NIB/SIUP)
            </label>
            <div 
              onClick={() => setIzinName("Surat_Izin_Berusaha_NIB.pdf")}
              className="border border-dashed border-white/10 hover:border-[#e05c2a] rounded-xl p-4 cursor-pointer transition-all bg-[#4a4a4a] flex items-center gap-4 justify-start"
            >
              <span className="text-xl pl-2">📄</span>
              <div className="text-left truncate">
                <span className="block text-xs font-bold text-gray-200">
                  {izinName ? izinName : "Pilih / Ambil Dokumen Surat Izin"}
                </span>
                <span className="text-[10px] text-gray-400 font-medium block mt-0.5">
                  Format PDF / DOCX maks 10MB
                </span>
              </div>
            </div>
          </div>

          {/* Tombol Aksi Bawah */}
          <div className="space-y-4 pt-4">
            <button 
              type="submit" 
              className="w-full inline-flex items-center justify-center font-bold text-sm py-3.5 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer shadow-md tracking-wide"
            >
              Analisis & Mulai Evaluasi →
            </button>
            
            <button 
              type="button"
              onClick={() => navigate("dashboard")}
              className="w-full text-center text-xs font-bold text-gray-400 hover:text-white transition-colors py-1 uppercase tracking-widest block"
            >
              ← Batal & Kembali
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}