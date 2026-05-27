import React, { useState } from 'react';
import type { PageName, BusinessData } from "../App";
import TambahUsaha from "./TambahUsaha"; 

interface DashboardProps {
  navigate: (page: PageName) => void;
  businessList: BusinessData[]; 
  setBusinessList: React.Dispatch<React.SetStateAction<BusinessData[]>>; 
  setActiveBusinessName: (name: string) => void; 
}

export default function Dashboard({ navigate, businessList, setBusinessList, setActiveBusinessName }: DashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleStartEvaluation = (namaUsaha: string) => {
    setActiveBusinessName(namaUsaha); 
    navigate("step1"); 
  };

  return (
    <div className="min-h-screen bg-[#2d2d2d] text-[#f0ece8] p-6 md:p-12 font-body antialiased">
      
      {/* HEADER DASHBOARD */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="font-head text-2xl md:text-3xl font-bold text-white">Dashboard Akun</h1>
          <p className="text-[0.9rem] text-[#b0a89e] mt-1">Kelola dan pantau pengajuan sertifikasi hijau usaha Anda.</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 font-bold text-[0.9rem] px-5 py-3 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] hover:shadow-[0_6px_20px_rgba(224,92,42,0.3)] transition-all cursor-pointer select-none"
        >
          <span>＋</span> Tambah Usaha Baru
        </button>
      </div>

      {/* SEKSI UTAMA: EMPTY STATE */}
      {businessList.length === 0 ? (
        <div className="max-w-md mx-auto border border-white/[0.06] rounded-[24px] p-10 text-center bg-white/[0.01] shadow-xl mt-12 animate-fadeIn">
          <div className="text-5xl mb-4 select-none">🌱</div>
          <h2 className="font-head text-[1.2rem] font-bold text-white mb-2">Belum Ada Usaha Terdaftar</h2>
          <p className="text-[#b0a89e] text-[0.88rem] leading-relaxed mb-6">
            Daftarkan identitas usaha pertama Anda untuk memulai analisis kecerdasan buatan AI & sertifikasi hijau.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="font-bold text-[0.88rem] px-6 py-3 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer"
          >
            + Daftarkan Usaha Pertama
          </button>
        </div>
      ) : (
        /* SEKSI UTAMA: ACTIVE STATE */
        <div className="max-w-7xl mx-auto bg-white/[0.02] border border-white/[0.08] rounded-[20px] overflow-hidden shadow-lg">
          <div className="p-6 border-b border-white/[0.08] bg-white/[0.01]">
            <h3 className="font-head text-[1.1rem] font-bold text-white">Daftar Pengajuan Terbaru</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[0.85rem] text-[#b0a89e] font-semibold uppercase tracking-wider">
                  <th className="p-5 pl-6">Nama Usaha</th>
                  <th className="p-5">Tanggal Diajukan</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 pr-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-[0.9rem]">
                {businessList.map((business) => (
                  <tr key={business.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-5 pl-6 font-medium text-white">{business.namaUsaha}</td>
                    <td className="p-5 text-[#b0a89e]">{business.tanggalDiajukan}</td>
                    <td className="p-5">
                      {business.status === "Diverifikasi" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[0.75rem] font-bold bg-[#4caf50]/10 border border-[#4caf50]/20 text-[#81c784]">
                          ✓ Diverifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[0.75rem] font-bold bg-[#ff9800]/10 border border-[#ff9800]/20 text-[#ffb74d]">
                          ⏳ Dalam Proses
                        </span>
                      )}
                    </td>
                    <td className="p-5 pr-6 text-center">
                      {business.status === "Diverifikasi" ? (
                        <button
                          onClick={() => handleStartEvaluation(business.namaUsaha)}
                          className="inline-flex items-center justify-center font-bold text-[0.82rem] px-4 py-2 rounded-lg bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer shadow-sm"
                        >
                          Mulai Evaluasi
                        </button>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center justify-center font-semibold text-[0.82rem] px-4 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-[#b0a89e]/50 cursor-not-allowed select-none"
                        >
                          Menunggu Verifikasi
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RENDER POP-UP INTERAKTIF MODAL */}
      <TambahUsaha 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        setBusinessList={setBusinessList} 
      />

    </div>
  );
}