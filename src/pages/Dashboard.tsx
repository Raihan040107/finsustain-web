import type { PageName } from "../App";

interface DashboardProps {
  navigate: (page: PageName) => void;
}

export default function Dashboard({ navigate }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-[#1a1a1a] font-body antialiased">
      {/* Navbar Mini Dashboard */}
      <nav className="bg-white border-b border-gray-100 h-[66px] px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2 font-head font-extrabold text-[1.1rem] cursor-pointer" onClick={() => navigate("home")}>
          <div className="w-8 h-8 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
          </div>
          <span>F-TECH <span className="text-[#e05c2a]">SOLUTION</span></span>
        </div>
        <button onClick={() => navigate("home")} className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wider">Log Out →</button>
      </nav>

      {/* Konten Dashboard */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-black font-head tracking-tight">Dashboard Analisis</h1>
            <p className="text-sm text-gray-500 font-medium mt-0.5">Pantau dan ajukan sertifikasi kredit hijau usaha Anda.</p>
          </div>
          <button 
            onClick={() => navigate("upload")}
            className="inline-flex items-center justify-center font-bold text-sm px-6 py-3 rounded-xl bg-[#2d3139] text-white hover:bg-black transition-all cursor-pointer shadow-sm"
          >
            + Ajukan Kredit Usaha
          </button>
        </div>

        {/* Kotak Kosong Informatif */}
        <div className="bg-white border border-gray-100 rounded-[22px] p-10 text-center shadow-[0_15px_40px_rgba(0,0,0,0.02)]">
          <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">📊</div>
          <h3 className="text-base font-bold text-gray-800 mb-1">Belum Ada Data Usaha</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto font-medium leading-relaxed">Silakan klik tombol di atas untuk mengunggah dokumen dan memulai pengisian kuisioner evaluasi ESG.</p>
        </div>
      </div>
    </div>
  );
}