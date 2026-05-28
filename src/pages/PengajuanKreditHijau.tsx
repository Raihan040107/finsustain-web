import type { PageName } from "../App";

interface PengajuanKreditHijauProps {
  navigate: (page: PageName) => void;
  namaUsaha: string;
}

export default function PengajuanKreditHijau({ navigate, namaUsaha }: PengajuanKreditHijauProps) {
  const handleKirimPengajuan = () => {
    alert("Pengajuan Kredit Hijau berhasil dikirim. Tim analis akan segera memprosesnya.");
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

        <div className="bg-[#4a4a4a]/40 p-7 rounded-2xl border border-white/5 shadow-inner space-y-7">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#e05c2a]">
              Detail Rekomendasi Kredit
            </h3>
          </div>

          <div className="space-y-6">
            <div className="bg-[#2d2d2d]/60 p-6 rounded-2xl border border-white/5">
              <span className="text-[10px] text-[#b0a89e] font-bold uppercase tracking-wider block mb-2">
                Plafon Kredit Direkomendasikan
              </span>
              <span className="text-3xl md:text-4xl font-black text-[#e05c2a] tracking-tight block">
                Rp 25.000.000
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#2d2d2d]/40 p-5 rounded-2xl border border-white/5">
                <span className="text-[9px] text-[#b0a89e] font-bold uppercase tracking-wider block mb-2">
                  Tenor Efektif
                </span>
                <span className="text-sm font-extrabold text-white">12 - 24 Bulan</span>
              </div>
              <div className="bg-[#2d2d2d]/40 p-5 rounded-2xl border border-white/5">
                <span className="text-[9px] text-[#b0a89e] font-bold uppercase tracking-wider block mb-2">
                  Suku Bunga Khusus
                </span>
                <span className="text-sm font-extrabold text-emerald-400">7.5%</span>
                <span className="text-[9px] font-medium text-[#b0a89e] block mt-1">
                  Lebih rendah dari standar pasar
                </span>
              </div>
            </div>

            <div className="bg-[#2d2d2d]/40 p-5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#e05c2a]/10 flex items-center justify-center border border-[#e05c2a]/20">
                  <svg className="w-4 h-4 text-[#e05c2a]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 2L3 6V11C3 15.4183 6.58172 18.8945 11 19C15.4183 18.8945 19 15.4183 19 11V6L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.5 10.5L9.5 12.5L12.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#e05c2a]">
                  Kualifikasi ESG Terpenuhi
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#b0a89e]">
                Pengajuan ini valid karena Skor ESG usaha Anda saat ini memenuhi batas minimal kelayakan sistem. Perkiraan pendanaan dapat diproses demi menjaga keberlanjutan operasi bisnis.
              </p>
            </div>
          </div>
        </div>

        {/* Bagian Tombol Navigasi Bawah */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("analisis")}
            className="w-full sm:w-auto text-center text-xs font-bold text-[#b0a89e] hover:text-white transition-colors py-3 uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16L6 10L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Lihat Skor ESG
          </button>

          <button
            type="button"
            onClick={handleKirimPengajuan}
            className="w-full sm:w-auto inline-flex items-center justify-center font-bold text-xs px-8 py-4 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer shadow-[0_8px_20px_-4px_rgba(224,92,42,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(224,92,42,0.5)] hover:-translate-y-0.5 tracking-wider uppercase"
          >
            <span>Kirim Pengajuan Kredit</span>
            <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}           