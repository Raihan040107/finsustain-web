import type { BusinessData, PageName } from '../App';

interface PortofolioUsahaProps {
  navigate: (page: PageName) => void;
  businessList: BusinessData[];
  logout: () => void;
}

const sectorLabels = [
  'Teknologi',
  'Manufaktur',
  'Energi',
  'Pertanian',
  'Kesehatan',
];

export default function PortofolioUsaha({ navigate, businessList, logout }: PortofolioUsahaProps) {
  return (
    <div className="min-h-screen bg-[#2d2d2d] text-[#f0ece8] font-body antialiased flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-[#232323] border-r border-white/[0.05] p-6 flex flex-col shrink-0">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#e05c2a] flex items-center justify-center text-white shadow-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-head text-xl font-bold tracking-wide text-white">F-Tech Solution</span>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-[#b0a89e]/50 mb-3 ml-2">Menu Utama</div>

          <button
            onClick={() => navigate('dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#b0a89e] hover:bg-white/[0.02] hover:text-white transition-colors text-left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </button>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.05] text-white border border-white/10 transition-colors text-left"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Portofolio Usaha
          </button>

          <button
            onClick={() => navigate('riwayat')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#b0a89e] hover:bg-white/[0.02] hover:text-white transition-colors text-left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Riwayat Evaluasi
          </button>
        </nav>

        <div className="pt-6 border-t border-white/[0.05] mt-auto">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-[#4a4a4a] flex items-center justify-center text-sm font-bold border border-white/10">U</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">User Name</p>
              <p className="text-xs text-[#b0a89e] truncate">Pemilik UMKM</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[#e05c2a] hover:bg-[#f06b35]/10 transition-colors text-sm font-medium text-left">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="font-head text-3xl font-bold text-white">Portofolio Usaha</h1>
              <p className="text-[#b0a89e] mt-2 max-w-2xl">Kelola informasi profil dan identitas legalitas bisnis Anda.</p>
            </div>
          </header>

          {businessList.length === 0 ? (
            <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-12 text-center shadow-lg">
              <svg className="w-16 h-16 mx-auto text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-3.866 0-7 1.79-7 4v4h14v-4c0-2.21-3.134-4-7-4zM12 4a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
              <h2 className="mt-6 text-2xl font-head font-bold text-white">Belum Ada Usaha pada Portofolio</h2>
              <p className="mt-3 text-[#b0a89e] text-sm leading-relaxed">Tambahkan usaha Anda untuk mulai mengelola profil, identitas legal, dan status verifikasi bisnis secara terpusat.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {businessList.map((business, index) => {
                const isVerified = business.status === 'Diverifikasi';
                const sector = sectorLabels[index % sectorLabels.length];

                return (
                  <article key={business.id} className="rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_18px_45px_-25px_rgba(0,0,0,0.65)] transition-all hover:border-[#e05c2a]/30">
                    <div className="flex items-start justify-between gap-3 mb-6">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-[#b0a89e]">{sector}</p>
                        <h2 className="mt-3 text-xl font-head font-bold text-white">{business.namaUsaha}</h2>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-[0.75rem] font-semibold ${isVerified ? 'bg-[#4caf50]/10 border border-[#4caf50]/20 text-[#81c784]' : 'bg-[#ff9800]/10 border border-[#ff9800]/20 text-[#ffb74d]'}`}>
                        {isVerified ? 'Diverifikasi' : 'Dalam Proses'}
                      </span>
                    </div>

                    <div className="space-y-4 text-sm text-[#b0a89e]">
                      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4">
                        <p className="text-[0.75rem] uppercase tracking-[0.18em] mb-1">Tanggal Dibuat</p>
                        <p className="text-white font-semibold">{business.tanggalDiajukan}</p>
                      </div>
                      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4">
                        <p className="text-[0.75rem] uppercase tracking-[0.18em] mb-1">Status Usaha</p>
                        <p className="text-white font-semibold">{sector}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                      <button type="button" className="w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#f0ece8] hover:border-white/[0.2] hover:bg-white/[0.06] transition-colors">
                        Lihat Profil Lengkap
                      </button>
                      <button type="button" className="w-full rounded-xl bg-[#e05c2a] px-4 py-3 text-sm font-semibold text-white hover:bg-[#f06b35] transition-colors">
                        Edit Data
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
