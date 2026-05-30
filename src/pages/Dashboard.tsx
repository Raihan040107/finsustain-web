import React, { useState } from 'react';
import type { PageName, BusinessData } from "../App";
import TambahUsaha from "./TambahUsaha"; 

interface DashboardProps {
  Maps: (page: PageName) => void;
  businessList: BusinessData[]; 
  setBusinessList: React.Dispatch<React.SetStateAction<BusinessData[]>>; 
  setActiveBusiness: (business: BusinessData) => void;
  refreshBusinessList: () => Promise<void>;
  logout: () => void;
  currentUser?: { name: string; email: string } | null;
}

export default function Dashboard({ Maps, businessList, setBusinessList, setActiveBusiness, refreshBusinessList, logout, currentUser }: DashboardProps) {
  const navigate = Maps;
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleStartEvaluation = (business: BusinessData) => {
    setActiveBusiness(business);
    navigate("step1"); 
  };

  const verifiedCount = businessList.filter(b => b.status === "Diverifikasi").length;
  const pendingCount = businessList.filter(b => b.status === "Dalam Proses").length;

  return (
    <div className="min-h-screen bg-[#2d2d2d] text-[#f0ece8] font-body antialiased flex flex-col md:flex-row">
      
      {/* ------------------- SIDEBAR KIRI ------------------- */}
      <aside className="w-full md:w-64 bg-[#232323] border-r border-white/[0.05] p-6 flex flex-col shrink-0">
        
        {/* Logo / Brand */}
        <div className="mb-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#e05c2a] flex items-center justify-center text-white shadow-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-head text-xl font-bold tracking-wide text-white">F-Tech Solution</span>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-[#b0a89e]/50 mb-3 ml-2">Menu Utama</div>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.05] text-white font-medium transition-colors border border-white/10">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </button>
          
          <button
            onClick={() => navigate("portofolio")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#b0a89e] hover:bg-white/[0.02] hover:text-white transition-colors text-left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Portofolio Usaha
          </button>
          
          <button
            onClick={() => Maps('riwayat')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#b0a89e] hover:bg-white/[0.02] hover:text-white transition-colors text-left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Riwayat Evaluasi
          </button>
        </nav>

        {/* User Profile / Utility (Bawah) */}
        <div className="pt-6 border-t border-white/[0.05] mt-auto">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-[#4a4a4a] flex items-center justify-center text-sm font-bold border border-white/10">
              {(currentUser?.name ?? "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{currentUser?.name ?? "Pengguna"}</p>
              <p className="text-xs text-[#b0a89e] truncate">{currentUser?.email ?? "Pemilik UMKM"}</p>
            </div>
          </div>
          
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium text-left">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </div>
      </aside>


      {/* ------------------- KONTEN KANAN ------------------- */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
        
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
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Usaha
          </button>
        </div>

        {/* JIKA KOSONG */}
        {businessList.length === 0 ? (
          <div className="max-w-md mx-auto border border-white/[0.06] rounded-[24px] p-10 text-center bg-white/[0.01] shadow-xl mt-12 animate-fadeIn">
            <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
            <h2 className="font-head text-[1.2rem] font-bold text-white mb-2">Belum Ada Usaha Terdaftar</h2>
            <p className="text-[#b0a89e] text-[0.88rem] leading-relaxed mb-6">
              Daftarkan identitas usaha pertama Anda untuk memulai evaluasi dan pengajuan sertifikasi.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="font-bold text-[0.88rem] px-6 py-3 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
              </svg>
              Daftarkan Usaha
            </button>
          </div>
        ) : (
          /* JIKA ADA DATA (ACTIVE STATE) */
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* SUMMARY CARDS (STATISTIK) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#b0a89e] uppercase tracking-wider mb-1">Total Usaha</p>
                  <p className="text-3xl font-head font-bold text-white">{businessList.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#b0a89e] uppercase tracking-wider mb-1">Diverifikasi</p>
                  <p className="text-3xl font-head font-bold text-[#81c784]">{verifiedCount}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#4caf50]/10 flex items-center justify-center text-[#81c784]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#b0a89e] uppercase tracking-wider mb-1">Menunggu</p>
                  <p className="text-3xl font-head font-bold text-[#ffb74d]">{pendingCount}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#ff9800]/10 flex items-center justify-center text-[#ffb74d]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* TABEL DATA */}
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-[20px] overflow-hidden shadow-lg">
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
                              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                              Diverifikasi
                            </span>
                          ) : business.status === "Ditolak" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[0.75rem] font-bold bg-[#ef5350]/10 border border-[#ef5350]/20 text-[#f28b82]">
                              Ditolak
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[0.75rem] font-bold bg-[#ff9800]/10 border border-[#ff9800]/20 text-[#ffb74d]">
                              <span className="animate-pulse mr-1.5 h-2 w-2 rounded-full bg-[#ffb74d] inline-block"></span>
                              Dalam Proses
                            </span>
                          )}
                        </td>
                        <td className="p-5 pr-6 text-center">
                          {business.status === "Diverifikasi" ? (
                            <button
                              onClick={() => handleStartEvaluation(business)}
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

          </div>
        )}

        {/* RENDER POP-UP INTERAKTIF MODAL */}
        <TambahUsaha 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          setBusinessList={setBusinessList} 
          onCreated={refreshBusinessList}
        />
      </main>

    </div>
  );
}
