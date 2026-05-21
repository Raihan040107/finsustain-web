import React from "react";
import type { PageName } from "../App";

interface AnalisisESGProps {
  navigate: (page: PageName) => void;
  namaUsaha: string;
}

export default function AnalisisESG({ navigate, namaUsaha }: AnalisisESGProps) {
  // Dummy data skor
  const skorUtama = 65;
  const dataAspek = [
    { label: "Lingkungan", skor: 26, ikon: "🌿" },
    { label: "Sosial", skor: 28, ikon: "🤝" },
    { label: "Tata Kelola", skor: 21, ikon: "🏢" },
  ];

  return (
    <div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 font-body antialiased text-white relative overflow-hidden">
      
      {/* Background Efek Aura Glow Oranye Lembut */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e05c2a]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Container Card Utama */}
      <div className="w-full sm:max-w-xl bg-[#3a3a3a] p-8 sm:p-10 rounded-[32px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] border border-white/5 transition-all relative z-10 backdrop-blur-sm">
        
        {/* Header Hasil */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="relative mb-6">
            <h2 className="font-head text-3xl font-black tracking-wide text-white drop-shadow-md truncate max-w-[350px]">
              {namaUsaha || "Toko Sinar Mentari"}
            </h2>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#e05c2a] rounded-full"></div>
          </div>

          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1 mb-6">
            Raport Analisis Keberlanjutan
          </p>
          
          {/* Badge Skor Utama - DESAIN PRESTISIUS & PROPORSIONAL */}
          <div className="inline-flex items-center justify-center bg-gradient-to-br from-[#4a4a4a] to-[#3a3a3a] p-[1.5px] rounded-2xl shadow-[0_15px_35px_-5px_rgba(0,0,0,0.5)] border border-white/10 group hover:border-[#e05c2a]/30 transition-all duration-500">
            <div className="flex items-center bg-[#2d2d2d]/90 px-6 py-3 rounded-[15px] relative overflow-hidden backdrop-blur-md">
              
              {/* Efek gradasi glossy halus di latar belakang badge */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>

              {/* Sisi Kiri: Nilai Angka */}
              <div className="flex items-baseline pr-5 select-none">
                <span className="text-4xl font-black text-[#e05c2a] tracking-tight drop-shadow-[0_4px_12px_rgba(224,92,42,0.25)]">
                  {skorUtama}
                </span>
                <span className="text-xs font-bold text-gray-500 ml-1 tracking-wider uppercase">
                  /100
                </span>
              </div>
              
              {/* Garis Pembatas Vertikal yang Minimalis & Mewah */}
              <div className="w-[1px] h-7 bg-gradient-to-b from-white/5 via-white/20 to-white/5"></div>

              {/* Sisi Kanan: Status Evaluasi dengan Soft Glow */}
              <div className="pl-5 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-xs font-extrabold text-amber-400 tracking-widest uppercase bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 shadow-[inset_0_1px_10px_rgba(245,158,11,0.05)]">
                  Cukup
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Konten Utama */}
        <div className="space-y-6 pt-6 border-t border-white/5 text-left">
          
          {/* Rincian Skor Aspek (ESG) */}
          <div className="bg-[#4a4a4a]/50 p-5 rounded-2xl space-y-4 border border-white/5 shadow-inner">
            
            {/* Navigasi Header Sub-Aspek */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">📊</span>
                <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#e05c2a]">
                  Rincian Skor Aspek ESG
                </h4>
              </div>
              <div className="flex items-center gap-1.5 bg-[#3a3a3a] px-2.5 py-1 rounded-md border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Target: 80+</span>
              </div>
            </div>
            
            {/* Progress Bars */}
            <div className="space-y-4 pt-1">
              {dataAspek.map((item, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-300 flex items-center gap-2">
                      <span className="text-base">{item.ikon}</span> 
                      {item.label}
                    </span>
                    <span className="text-white font-bold">{item.skor} / 100</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
                    <div className="absolute top-0 left-0 h-full bg-[#e05c2a] rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.skor}%` }}>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-white/10 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bagian Insight Rekomendasi */}
          <div className="bg-[#4a4a4a]/50 p-5 rounded-2xl space-y-3 border border-white/5 shadow-inner relative overflow-hidden">
            <div className="absolute -bottom-5 -right-5 text-7xl opacity-[0.03] rotate-[-15deg] pointer-events-none">💡</div>
            <h4 className="text-[12px] font-black uppercase tracking-wider text-[#e05c2a] border-b border-white/5 pb-2">
              💡 Rekomendasi Strategis UMKM
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-200 font-medium leading-relaxed pl-1 pt-1">
              <li className="flex items-start gap-2.5 group">
                <span className="text-[#e05c2a] font-black text-sm mt-0.5 group-hover:scale-125 transition-transform">•</span>
                <span className="group-hover:text-white transition-colors">Ganti sumber listrik ke <strong>panel surya mini 300W</strong> untuk meningkatkan skor Lingkungan.</span>
              </li>
              <li className="flex items-start gap-2.5 group">
                <span className="text-[#e05c2a] font-black text-sm mt-0.5 group-hover:scale-125 transition-transform">•</span>
                <span className="group-hover:text-white transition-colors">Adopsi <strong>pembukuan finansial digital</strong> untuk menaikkan skor Tata Kelola.</span>
              </li>
              <li className="flex items-start gap-2.5 group">
                <span className="text-[#e05c2a] font-black text-sm mt-0.5 group-hover:scale-125 transition-transform">•</span>
                <span className="group-hover:text-white transition-colors">Sediakan program pelatihan kerja karyawan minimal 6 jam/bulan.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bagian Tombol Aksi Bawah */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("upload")}
            className="w-full sm:w-auto text-center text-xs font-bold text-gray-400 hover:text-white transition-colors py-2 uppercase tracking-wider group flex items-center justify-center gap-1.5"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Evaluasi Ulang
          </button>

          <button
            type="button"
            onClick={() => {
              alert("Mengalihkan ke simulasi pengajuan Kredit Hijau..");
              navigate("pengajuan-kredit" as any);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center font-bold text-xs px-6 py-4 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer shadow-[0_8px_20px_-4px_rgba(224,92,42,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(224,92,42,0.5)] hover:-translate-y-0.5 tracking-wider uppercase group"
          >
            Lanjut Kredit Hijau <span className="ml-1.5 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

      </div>
    </div>
  );
}