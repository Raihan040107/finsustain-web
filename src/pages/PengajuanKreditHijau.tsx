import React, { useState } from "react";
import type { PageName } from "../App";

interface PengajuanKreditHijauProps {
  navigate: (page: PageName) => void;
  namaUsaha: string;
}

export default function PengajuanKreditHijau({ navigate, namaUsaha }: PengajuanKreditHijauProps) {
  // State dummy untuk menyimpan nama file yang diunggah
  const [files, setFiles] = useState<{ [key: string]: string }>({
    ktp: "",
    izinUsaha: "",
    rekeningKoran: "",
  });

  // Handler simulasi upload file
  const handleSimulateUpload = (field: string, defaultName: string) => {
    setFiles((prev) => ({
      ...prev,
      [field]: prev[field] ? "" : defaultName, // Toggle upload/hapus berkas
    }));
  };

  const handleKirimPengajuan = () => {
    if (!files.ktp || !files.izinUsaha || !files.rekeningKoran) {
      alert("Silakan lengkapi semua dokumen persyaratan terlebih dahulu!");
      return;
    }
    alert("🚀 Pengajuan Kredit Hijau berhasil dikirim! Tim analis kami akan segera memverifikasi berkas Anda.");
    navigate("dashboard");
  };

  return (
    <div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 font-body antialiased text-white relative overflow-hidden">
      
      {/* Background Efek Aura Glow Oranye Lembut (Konsisten Tema) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#e05c2a]/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Container Utama Besar */}
      <div className="w-full max-w-4xl bg-[#3a3a3a] p-6 sm:p-10 rounded-[32px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] border border-white/5 transition-all relative z-10 backdrop-blur-sm text-left">
        
        {/* Header Halaman */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="relative mb-3">
            <h2 className="font-head text-3xl font-black tracking-wide text-white drop-shadow-md uppercase">
              Pengajuan Kredit Hijau
            </h2>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#e05c2a] rounded-full"></div>
          </div>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-2">
            Simulasi Pendanaan Berkelanjutan • {namaUsaha || "Toko Sinar Mentari"}
          </p>
        </div>

        {/* Layout Grid Kiri & Kanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* KELOMPOK KIRI: Detail Informasi Kredit */}
          <div className="bg-[#4a4a4a]/40 p-6 sm:p-7 rounded-2xl border border-white/5 shadow-inner space-y-5 h-full">
            <div className="border-b border-white/5 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#e05c2a] flex items-center gap-2">
                💵 Detail Rekomendasi Kredit
              </h3>
            </div>

            <div className="space-y-4">
              {/* Plafon Box */}
              <div className="bg-[#2d2d2d]/60 p-4 rounded-xl border border-white/5 relative overflow-hidden">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                  Plafon Kredit Direkomendasikan
                </span>
                <span className="text-2xl font-black text-[#e05c2a] tracking-tight drop-shadow-[0_2px_8px_rgba(224,92,42,0.2)]">
                  Rp 25.000.000
                </span>
              </div>

              {/* Grid Mini Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#2d2d2d]/40 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Tenor Efektif</span>
                  <span className="text-sm font-extrabold text-white">12 - 24 Bulan</span>
                </div>
                <div className="bg-[#2d2d2d]/40 p-3 rounded-xl border border-white/5">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Suku Bunga Khusus</span>
                  <span className="text-sm font-extrabold text-emerald-400 flex items-center gap-1">
                    7.5% <span className="text-[9px] font-medium text-gray-400 font-sans">(Lebih Rendah)</span>
                  </span>
                </div>
              </div>

              {/* Syarat Minimal Validasi */}
              <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 flex items-start gap-3">
                <span className="text-base mt-0.5">🛡️</span>
                <div className="text-xs font-medium text-gray-300 leading-relaxed">
                  <strong className="text-amber-400 block mb-0.5 uppercase tracking-wide text-[10px]">Kualifikasi ESG Terpenuhi</strong>
                  Pengajuan ini valid karena Skor ESG usaha Anda saat ini memenuhi batas minimal kelayakan sistem (<span className="text-amber-400 font-bold">Minimal 70</span>).
                </div>
              </div>
            </div>
          </div>

          {/* KELOMPOK KANAN: Unggah Berkas Persyaratan */}
          <div className="bg-[#4a4a4a]/40 p-6 sm:p-7 rounded-2xl border border-white/5 shadow-inner space-y-5">
            <div className="border-b border-white/5 pb-3 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#e05c2a] flex items-center gap-2">
                📝 Berkas Persyaratan (Upload)
              </h3>
              <span className="text-[9px] bg-white/5 text-gray-400 px-2 py-0.5 rounded font-bold uppercase">Maks 5-10MB</span>
            </div>

            <div className="space-y-3.5">
              
              {/* Item 1: KTP */}
              <div 
                onClick={() => handleSimulateUpload("ktp", "KTP_Pemilik_Usaha.pdf")}
                className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                  files.ktp ? "bg-emerald-500/10 border-emerald-500/30" : "bg-[#2d2d2d]/60 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-3 truncate pr-2">
                  <span className="text-xl select-none">🪪</span>
                  <div className="truncate">
                    <span className="text-xs font-bold text-gray-200 block group-hover:text-white transition-colors">Kartu Tanda Penduduk (KTP)</span>
                    <span className={`text-[10px] block truncate ${files.ktp ? "text-emerald-400 font-semibold" : "text-gray-500"}`}>
                      {files.ktp || "Format PDF / JPG"}
                    </span>
                  </div>
                </div>
                <span className={`text-xs font-black shrink-0 px-2.5 py-1 rounded-md border tracking-wider uppercase ${
                  files.ktp ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-white/5 text-gray-400 border-white/5 group-hover:text-white"
                }`}>
                  {files.ktp ? "✓ Ada" : "Pilih"}
                </span>
              </div>

              {/* Item 2: Surat Izin Usaha */}
              <div 
                onClick={() => handleSimulateUpload("izinUsaha", "NIB_Sinar_Mentari.pdf")}
                className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                  files.izinUsaha ? "bg-emerald-500/10 border-emerald-500/30" : "bg-[#2d2d2d]/60 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-3 truncate pr-2">
                  <span className="text-xl select-none">📄</span>
                  <div className="truncate">
                    <span className="text-xs font-bold text-gray-200 block group-hover:text-white transition-colors">Surat Izin Usaha (NIB / SIUP)</span>
                    <span className={`text-[10px] block truncate ${files.izinUsaha ? "text-emerald-400 font-semibold" : "text-gray-500"}`}>
                      {files.izinUsaha || "Format PDF / DOCX"}
                    </span>
                  </div>
                </div>
                <span className={`text-xs font-black shrink-0 px-2.5 py-1 rounded-md border tracking-wider uppercase ${
                  files.izinUsaha ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-white/5 text-gray-400 border-white/5 group-hover:text-white"
                }`}>
                  {files.izinUsaha ? "✓ Ada" : "Pilih"}
                </span>
              </div>

              {/* Item 3: Rekening Koran */}
              <div 
                onClick={() => handleSimulateUpload("rekeningKoran", "Rekening_Koran_3Bulan.pdf")}
                className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                  files.rekeningKoran ? "bg-emerald-500/10 border-emerald-500/30" : "bg-[#2d2d2d]/60 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-3 truncate pr-2">
                  <span className="text-xl select-none">📊</span>
                  <div className="truncate">
                    <span className="text-xs font-bold text-gray-200 block group-hover:text-white transition-colors">Rekening Koran (3 Bulan Terakhir)</span>
                    <span className={`text-[10px] block truncate ${files.rekeningKoran ? "text-emerald-400 font-semibold" : "text-gray-500"}`}>
                      {files.rekeningKoran || "Format PDF murni"}
                    </span>
                  </div>
                </div>
                <span className={`text-xs font-black shrink-0 px-2.5 py-1 rounded-md border tracking-wider uppercase ${
                  files.rekeningKoran ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-white/5 text-gray-400 border-white/5 group-hover:text-white"
                }`}>
                  {files.rekeningKoran ? "✓ Ada" : "Pilih"}
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Bagian Tombol Navigasi Bawah */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("analisis")} // Kembali ke page raport analisis ESG
            className="w-full sm:w-auto text-center text-xs font-bold text-gray-400 hover:text-white transition-colors py-2 uppercase tracking-wider group flex items-center justify-center gap-1.5"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Lihat Skor ESG
          </button>

          <button
            type="button"
            onClick={handleKirimPengajuan}
            className="w-full sm:w-auto inline-flex items-center justify-center font-bold text-xs px-8 py-4 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer shadow-[0_8px_20px_-4px_rgba(224,92,42,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(224,92,42,0.5)] hover:-translate-y-0.5 tracking-wider uppercase group"
          >
            Kirim Pengajuan Kredit <span className="ml-1.5 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

      </div>
    </div>
  );
}           