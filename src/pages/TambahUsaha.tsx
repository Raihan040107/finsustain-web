import React, { useState } from "react";
import type { PageName } from "../App";

interface TambahUsahaProps {
  navigate: (page: PageName) => void;
  // Menambahkan prop untuk mengirimkan data ke state global App.tsx
  setGlobalBusiness: (data: { namaUsaha: string; bidangUsaha: string; alamatUsaha: string }) => void;
}

export default function TambahUsaha({ navigate, setGlobalBusiness }: TambahUsahaProps) {
  // 1. State untuk Profil Usaha
  const [namaUsaha, setNamaUsaha] = useState("");
  const [namaPemilik, setNamaPemilik] = useState("");
  const [bidangUsaha, setBidangUsaha] = useState("");
  const [alamatUsaha, setAlamatUsaha] = useState("");

  // 2. State untuk File Dokumen
  const [ktpName, setKtpName] = useState("");
  const [npwpName, setNpwpName] = useState("");
  const [izinName, setIzinName] = useState("");

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi input profil
    if (!namaUsaha || !namaPemilik || !bidangUsaha || !alamatUsaha) {
      alert("Silakan lengkapi Profil Usaha Anda terlebih dahulu!");
      return;
    }
    
    // Validasi upload dokumen
    if (!ktpName || !npwpName || !izinName) {
      alert("Silakan unggah semua dokumen terlebih dahulu (KTP, NPWP, dan Surat Izin)!");
      return;
    }
    
    // Alirkan data nama usaha ke state global App.tsx sebelum pindah halaman
    setGlobalBusiness({ namaUsaha, bidangUsaha, alamatUsaha });
    
    // Jika semua aman, lanjut ke form pertanyaan ESG
    navigate("step1");
  };

  return (
    <div className="min-h-screen bg-[#2d2d2d] flex flex-col justify-center py-12 px-6 lg:px-8 font-body antialiased text-white">
      
      {/* Container Card Tengah (Sedikit diperlebar jd max-w-lg agar form profil & upload muat rapi) */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg bg-[#3a3a3a] p-8 md:p-10 rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-white/5">
        
        {/* JUDUL TETAP RATA TENGAH */}
        <div className="text-center mb-8">
          <h2 className="font-head text-[1.65rem] font-black tracking-tight text-white leading-tight">
            Registrasi & Unggah Dokumen
          </h2>
          <p className="mt-2 text-xs text-gray-400 font-medium tracking-wide">
            Lengkapi profil bisnis dan berkas legalitas operasional UMKM Anda
          </p>
        </div>

        {/* Form Utama (Isinya Rata Kiri) */}
        <form onSubmit={handleNextStep} className="space-y-6 text-left">
          
          {/* ================= BAGIAN 1: PROFIL USAHA ================= */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#e05c2a] border-b border-white/5 pb-2">
              📂 I. Profil Usaha
            </h3>
            
            {/* Nama Usaha */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Nama Usaha / Perusahaan</label>
              <input
                type="text"
                required
                value={namaUsaha}
                onChange={(e) => setNamaUsaha(e.target.value)}
                placeholder="Contoh: Toko Sinar Mentari"
                className="w-full px-4 py-3 rounded-xl border border-white/10 text-xs focus:outline-none focus:border-[#e05c2a] bg-[#4a4a4a] text-white placeholder-gray-500 transition-all"
              />
            </div>

            {/* Nama Pemilik */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Nama Pemilik (Owner)</label>
              <input
                type="text"
                required
                value={namaPemilik}
                onChange={(e) => setNamaPemilik(e.target.value)}
                placeholder="Nama sesuai KTP"
                className="w-full px-4 py-3 rounded-xl border border-white/10 text-xs focus:outline-none focus:border-[#e05c2a] bg-[#4a4a4a] text-white placeholder-gray-500 transition-all"
              />
            </div>

            {/* Grid 2 Kolom untuk Bidang Usaha & Alamat Singkat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Bidang Usaha</label>
                <select
                  required
                  value={bidangUsaha}
                  onChange={(e) => setBidangUsaha(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 text-xs focus:outline-none focus:border-[#e05c2a] bg-[#4a4a4a] text-white transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-gray-500">Pilih Bidang</option>
                  <option value="Kuliner">Kuliner / Makanan</option>
                  <option value="Fashion">Fashion / Pakaian</option>
                  <option value="Agribisnis">Agribisnis / Pertanian</option>
                  <option value="Jasa">Jasa / Servis</option>
                  <option value="Manufaktur">Manufaktur / Kerajinan</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Kota / Lokasi Usaha</label>
                <input
                  type="text"
                  required
                  value={alamatUsaha}
                  onChange={(e) => setAlamatUsaha(e.target.value)}
                  placeholder="Contoh: Malang, Jawa Timur"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 text-xs focus:outline-none focus:border-[#e05c2a] bg-[#4a4a4a] text-white placeholder-gray-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* ================= BAGIAN 2: UPLOAD DOKUMEN ================= */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#e05c2a] border-b border-white/5 pb-2">
              📜 II. Dokumen Legalitas
            </h3>

            {/* 1. Slot Unggah KTP */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">KTP Pemilik</label>
              <div 
                onClick={() => setKtpName("KTP_Pemilik_Usaha.pdf")}
                className="border border-dashed border-white/10 hover:border-[#e05c2a] rounded-xl p-3.5 cursor-pointer transition-all bg-[#4a4a4a] flex items-center gap-4 justify-start"
              >
                <span className="text-xl pl-1">🪪</span>
                <div className="truncate">
                  <span className="block text-xs font-bold text-gray-200">
                    {ktpName ? ktpName : "Pilih / Ambil Berkas KTP"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium block mt-0.5">PDF / JPG maks 5MB</span>
                </div>
              </div>
            </div>

            {/* 2. Slot Unggah NPWP */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">NPWP BADAN / PERORANGAN</label>
              <div 
                onClick={() => setNpwpName("NPWP_Usaha_Active.pdf")}
                className="border border-dashed border-white/10 hover:border-[#e05c2a] rounded-xl p-3.5 cursor-pointer transition-all bg-[#4a4a4a] flex items-center gap-4 justify-start"
              >
                <span className="text-xl pl-1">💳</span>
                <div className="truncate">
                  <span className="block text-xs font-bold text-gray-200">
                    {npwpName ? npwpName : "Pilih / Ambil Berkas NPWP"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium block mt-0.5">PDF / PNG maks 5MB</span>
                </div>
              </div>
            </div>

            {/* 3. Slot Unggah Surat Izin Usaha */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">SURAT IZIN USAHA (NIB/SIUP)</label>
              <div 
                onClick={() => setIzinName("Surat_Izin_Berusaha_NIB.pdf")}
                className="border border-dashed border-white/10 hover:border-[#e05c2a] rounded-xl p-3.5 cursor-pointer transition-all bg-[#4a4a4a] flex items-center gap-4 justify-start"
              >
                <span className="text-xl pl-1">📄</span>
                <div className="truncate">
                  <span className="block text-xs font-bold text-gray-200">
                    {izinName ? izinName : "Pilih / Ambil Dokumen Surat Izin"}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium block mt-0.5">PDF / DOCX maks 10MB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Navigasi Bawah */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <button 
              type="submit" 
              className="w-full inline-flex items-center justify-center font-bold text-xs py-3.5 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer shadow-md tracking-wider uppercase"
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