import type { PageName } from "../App";

interface DashboardProps {
  navigate: (page: PageName) => void;
}

export default function Dashboard({ navigate }: DashboardProps) {
  // Data dummy simulasi pengajuan terbaru dengan gaya gelap
  const daftarPengajuan = [
    { id: 1, nama: "PT Tekno Hijau Sejahtera", tanggal: "27 Mei 2026", status: "Diverifikasi", warnaStatus: "bg-green-500/10 text-green-400 border-green-500/20" },
    { id: 2, nama: "CV Sinar Mandiri", tanggal: "21 Mei 2026", status: "Dalam Proses", warnaStatus: "bg-amber-500/10 text-amber-400 border-amber-500/20" }
  ];

  return (
    // Background luar dikunci abu-abu gelap #2d2d2d agar konsisten penuh dengan Landing Page & Login
    <div className="min-h-screen bg-[#2d2d2d] text-white font-body antialiased flex flex-col">
      
      {/* 1. Navbar Utama Atas Versi Gelap */}
      <nav className="bg-[#2d2d2d] border-b border-white/5 h-[66px] px-6 md:px-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 font-head font-bold text-[1.1rem] cursor-pointer" onClick={() => navigate("home")}>
          {/* Logo kotak oranye icon sesuai landing page */}
          <div className="w-8 h-8 bg-[#e05c2a] rounded-lg flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm3 12h2v-2h2v2h2v2h-2v2h-2v-2h-2v-2z" />
            </svg>
          </div>
          <span className="tracking-wide">Fin <span className="text-[#e05c2a]">Sustain</span></span>
        </div>
        <button 
          onClick={() => navigate("home")} 
          className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider transition-colors"
        >
          LOG OUT →
        </button>
      </nav>

      {/* 2. Area Konten Utama Dashboard */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Atas: Judul & Tombol Aksi Oranye Khas */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-2xl font-bold font-head tracking-wide">Dashboard Analisis</h1>
            <p className="text-sm text-gray-400 font-normal mt-0.5">Pantau dan ajukan sertifikasi kredit hijau usaha Anda.</p>
          </div>
          <button 
            onClick={() => navigate("upload")}
            className="inline-flex items-center justify-center font-bold text-sm px-6 py-3 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer shadow-md tracking-wide"
          >
            + Ajukan Kredit Usaha
          </button>
        </div>

        {/* Tengah: Layout Grid Ringkasan & Grafik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Kolom Kiri & Tengah: Grafik Tren Pertumbuhan (Card Gelap #3a3a3a) */}
          <div className="lg:col-span-2 bg-[#3a3a3a] border border-white/5 rounded-[22px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.2)] flex flex-col justify-between min-h-[340px]">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-white tracking-wide">Dashboard Analisis Ringkasan</h3>
                <span className="text-xs font-bold text-gray-300 px-3 py-1.5 bg-[#4a4a4a] border border-white/5 rounded-lg select-none">Pertahunan v</span>
              </div>
              <p className="text-xs font-semibold text-gray-400 mb-6">Pertumbuhan Omzet Usaha</p>
            </div>
            
            {/* Grafik Garis Dengan Warna Oranye Kebanggaan */}
            <div className="relative flex-1 flex items-end h-40 w-full pt-4 border-b border-l border-white/10">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e05c2a" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#e05c2a" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 80 Q 80 50 160 40 T 320 20 T 400 10 L 400 100 L 0 100 Z" fill="url(#chartGrad)" />
                <path d="M 0 80 Q 80 50 160 40 T 320 20 T 400 10" fill="none" stroke="#e05c2a" strokeWidth="3" strokeLinecap="round" />
                <circle cx="160" cy="40" r="5" fill="#e05c2a" stroke="#3a3a3a" strokeWidth="2" />
              </svg>
              {/* Label Sumbu X */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] font-bold text-gray-400 px-1">
                <span>Jan</span><span>Mar</span><span>Mei</span><span>Jul</span><span>Sep</span><span>Nov</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Tiga Widget Metrik Utama ESG Gelap */}
          <div className="flex flex-col gap-4">
            {/* Kartu 1: Skor ESG */}
            <div className="bg-[#3a3a3a] border border-white/5 rounded-[18px] p-5 shadow-[0_15px_30px_rgba(0,0,0,0.15)] flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 block">Skor ESG Terakhir</span>
                <span className="text-2xl font-bold font-head tracking-tight text-white">75/100</span>
                <div className="w-28 bg-[#4a4a4a] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#e05c2a] h-full" style={{ width: "75%" }}></div>
                </div>
              </div>
              <div className="w-10 h-10 bg-[#e05c2a]/10 border border-[#e05c2a]/20 rounded-xl flex items-center justify-center text-sm">🌱</div>
            </div>

            {/* Kartu 2: Reduksi Karbon */}
            <div className="bg-[#3a3a3a] border border-white/5 rounded-[18px] p-5 shadow-[0_15px_30px_rgba(0,0,0,0.15)] flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-gray-400 block">Reduksi Emisi Karbon</span>
                <span className="text-2xl font-bold font-head tracking-tight text-green-400">-12.4%</span>
                <p className="text-[10px] text-gray-500 font-normal">Berdasarkan operasional bulanan</p>
              </div>
              <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center text-sm">📉</div>
            </div>

            {/* Kartu 3: Penghematan Listrik */}
            <div className="bg-[#3a3a3a] border border-white/5 rounded-[18px] p-5 shadow-[0_15px_30px_rgba(0,0,0,0.15)] flex justify-between items-center">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-gray-400 block">Penghematan Energi</span>
                <span className="text-2xl font-bold font-head tracking-tight text-white">Rp 1.5M+</span>
                <p className="text-[10px] text-gray-500 font-normal">Akumulasi konversi panel surya</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-sm">⚡</div>
            </div>

          </div>
        </div>

        {/* Bawah: Tabel Daftar Pengajuan Sertifikasi (Card Gelap #3a3a3a) */}
        <div className="bg-[#3a3a3a] border border-white/5 rounded-[22px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-white tracking-wide">Daftar Pengajuan Terbaru</h3>
            <span className="text-xs font-bold text-gray-400 hover:text-white cursor-pointer transition-colors">Lihat Semua Data v</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Nama Usaha / Perusahaan</th>
                  <th className="pb-3 font-semibold">Tanggal Diajukan</th>
                  <th className="pb-3 font-semibold">Status Sertifikasi</th>
                  <th className="pb-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm font-normal text-gray-300">
                {daftarPengajuan.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 font-bold text-white">{item.nama}</td>
                    <td className="py-4 text-gray-400">{item.tanggal}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${item.warnaStatus}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-4">
                      <button className="text-xs font-bold text-gray-400 hover:text-[#e05c2a] transition-colors">Detail</button>
                      <button className="text-xs font-bold text-red-400 hover:text-red-500 transition-colors">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}