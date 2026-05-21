import React, { useState } from "react";
import type { PageName } from "../App";

interface TambahUsahaProps {
  navigate: (page: PageName) => void;
}

export default function TambahUsaha({ navigate }: TambahUsahaProps) {
  const [fileName, setFileName] = useState("");

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    // Alur: Pindah ke Langkah 1 Pertanyaan Kuisioner
    navigate("step1");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-[#1a1a1a] font-body antialiased flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 rounded-[24px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
        
        <div className="text-center mb-8">
          <h2 className="font-head text-2xl font-black tracking-tight text-gray-900">Unggah Dokumen Usaha</h2>
          <p className="mt-1.5 text-sm text-gray-500 font-medium">Lengkapi berkas finansial atau legalitas operasional Anda</p>
        </div>

        <form onSubmit={handleNextStep} className="space-y-6">
          {/* Zona Drop File */}
          <div 
            onClick={() => setFileName("Laporan_Keuangan_2025.pdf")}
            className="border-2 border-dashed border-gray-200 hover:border-[#e05c2a] rounded-2xl p-8 text-center cursor-pointer transition-all bg-gray-50/50 group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📄</div>
            <span className="block text-sm font-bold text-gray-700 mb-1">
              {fileName ? fileName : "Pilih Berkas Dokumen"}
            </span>
            <span className="text-xs text-gray-400 font-medium">Mendukung format PDF, XLSX, atau DOCX hingga 10MB</span>
          </div>

          {/* Tombol Aksi Kelola Alur */}
          <div className="space-y-3">
            <button 
              type="submit" 
              className="w-full inline-flex items-center justify-center font-bold text-[0.95rem] py-3.5 rounded-xl bg-[#2d3139] text-white hover:bg-black transition-all cursor-pointer shadow-sm"
            >
              Analisis & Mulai Evaluasi →
            </button>
            <button 
              type="button"
              onClick={() => navigate("dashboard")}
              className="w-full text-center text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors py-1 uppercase tracking-widest"
            >
              ← Batal & Kembali
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}