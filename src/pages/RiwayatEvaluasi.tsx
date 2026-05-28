import type { BusinessData, PageName } from '../App';

interface RiwayatEvaluasiProps {
  Maps?: (page: PageName) => void;
  navigate?: (page: PageName) => void;
  businessList: BusinessData[];
  logout?: () => void;
}

type StatusKelulusan = 'Lulus Sertifikasi' | 'Dalam Peninjauan' | 'Perlu Perbaikan';

interface HistoryRecord {
  id: string;
  namaUsaha: string;
  tanggalEvaluasi: string;
  skorTotal: number;
  statusKelulusan: StatusKelulusan;
  e: number;
  s: number;
  g: number;
}

function getScoreTone(skor: number) {
  if (skor > 80) return 'text-[#81c784] bg-[#4caf50]/10 border-[#4caf50]/20';
  if (skor >= 50) return 'text-[#ffcc80] bg-[#ffb74d]/10 border-[#ffb74d]/20';
  return 'text-[#f28b82] bg-[#ef5350]/10 border-[#ef5350]/20';
}

function getStatusTone(status: StatusKelulusan) {
  if (status === 'Lulus Sertifikasi') return 'bg-[#4caf50]/10 text-[#81c784] border-[#4caf50]/20';
  if (status === 'Dalam Peninjauan') return 'bg-[#ffb74d]/10 text-[#ffcc80] border-[#ffb74d]/20';
  return 'bg-[#ef5350]/10 text-[#f28b82] border-[#ef5350]/20';
}

export default function RiwayatEvaluasi({ Maps, navigate, businessList, logout }: RiwayatEvaluasiProps) {
  const route = Maps ?? navigate;
  const historyData: HistoryRecord[] = businessList.length
    ? businessList.map((item, index) => ({
        id: item.id,
        namaUsaha: item.namaUsaha,
        tanggalEvaluasi: item.tanggalDiajukan,
        skorTotal: [91, 76, 44][index % 3],
        statusKelulusan: index % 3 === 0 ? 'Lulus Sertifikasi' : index % 3 === 1 ? 'Dalam Peninjauan' : 'Perlu Perbaikan',
        e: [30, 24, 12][index % 3],
        s: [29, 27, 14][index % 3],
        g: [32, 25, 18][index % 3],
      }))
    : [];

  const averageScore = historyData.length
    ? Math.round(historyData.reduce((sum, item) => sum + item.skorTotal, 0) / historyData.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#2d2d2d] text-[#f0ece8] font-body antialiased flex flex-col md:flex-row">
      {/* Sidebar */}
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
            onClick={() => route?.('dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#b0a89e] hover:bg-white/[0.02] hover:text-white transition-colors text-left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </button>

          <button
            onClick={() => route?.("portofolio")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#b0a89e] hover:bg-white/[0.02] hover:text-white transition-colors text-left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Portofolio Usaha
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.05] text-white font-medium border border-white/10 transition-colors text-left">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-medium text-left">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="text-[0.78rem] uppercase tracking-[0.25em] text-[#e05c2a] font-bold">Riwayat Evaluasi ESG</p>
              <h1 className="font-head text-2xl md:text-3xl font-bold text-white mt-2">Riwayat Evaluasi ESG</h1>
              <p className="text-[#b0a89e] mt-2 max-w-2xl">Pantau hasil evaluasi dan skor ESG dari usaha yang sudah Anda daftarkan sebelumnya.</p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 shadow-lg min-w-[260px]">
              <p className="text-[0.75rem] uppercase tracking-[0.18em] text-[#b0a89e]">Rata-rata skor</p>
              <p className="text-3xl font-head font-bold text-white mt-1">{averageScore}</p>
              <p className="text-[0.85rem] text-[#b0a89e]">dari {historyData.length} evaluasi terbaru</p>
            </div>
          </header>

          <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="space-y-5">
              {historyData.length === 0 ? (
                <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-10 text-center shadow-lg">
                  <svg className="w-16 h-16 mx-auto text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                  </svg>
                  <h2 className="mt-4 text-xl font-head font-bold text-white">Belum Ada Riwayat Evaluasi</h2>
                  <p className="mt-2 text-[#b0a89e]">Daftarkan usaha terlebih dahulu agar history evaluasi dapat muncul di sini.</p>
                </div>
              ) : (
                historyData.map((item) => (
                <article key={item.id} className="rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_18px_45px_-25px_rgba(0,0,0,0.65)] hover:border-[#e05c2a]/30 transition-all">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-head font-bold text-white">{item.namaUsaha}</h2>
                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.75rem] font-semibold ${getStatusTone(item.statusKelulusan)}`}>
                          {item.statusKelulusan}
                        </span>
                      </div>

                      <p className="text-sm text-[#b0a89e]">Tanggal evaluasi: {item.tanggalEvaluasi}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-3">
                          <p className="text-[#b0a89e] text-[0.75rem] uppercase tracking-wider">Lingkungan (E)</p>
                          <p className="text-white font-bold text-lg mt-1">{item.e}</p>
                        </div>
                        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-3">
                          <p className="text-[#b0a89e] text-[0.75rem] uppercase tracking-wider">Sosial (S)</p>
                          <p className="text-white font-bold text-lg mt-1">{item.s}</p>
                        </div>
                        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-3">
                          <p className="text-[#b0a89e] text-[0.75rem] uppercase tracking-wider">Tata Kelola (G)</p>
                          <p className="text-white font-bold text-lg mt-1">{item.g}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-3">
                      <div className={`rounded-2xl border px-4 py-3 min-w-[160px] ${getScoreTone(item.skorTotal)}`}>
                        <p className="text-[0.75rem] uppercase tracking-wider">Skor Total</p>
                        <p className="text-3xl font-head font-black">{item.skorTotal}</p>
                      </div>

                      <button
                        className="inline-flex items-center justify-center rounded-xl bg-[#e05c2a] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#f06b35] transition-all shadow-[0_8px_18px_-6px_rgba(224,92,42,0.35)]"
                      >
                        Lihat Detail Perhitungan
                      </button>
                    </div>
                  </div>
                </article>
                ))
              )}
            </div>

            <aside className="space-y-6">
              <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_18px_45px_-25px_rgba(0,0,0,0.6)]">
                <p className="text-[0.75rem] uppercase tracking-[0.18em] text-[#e05c2a] font-bold">Ringkasan</p>
                <div className="mt-4 space-y-3 text-sm text-[#f0ece8]">
                  <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] border border-white/[0.05] p-4">
                    <span className="text-[#b0a89e]">Lulus Sertifikasi</span>
                    <strong className="text-white text-lg">{historyData.filter((item) => item.statusKelulusan === 'Lulus Sertifikasi').length}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] border border-white/[0.05] p-4">
                    <span className="text-[#b0a89e]">Dalam Peninjauan</span>
                    <strong className="text-white text-lg">{historyData.filter((item) => item.statusKelulusan === 'Dalam Peninjauan').length}</strong>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/[0.03] border border-white/[0.05] p-4">
                    <span className="text-[#b0a89e]">Skor tertinggi</span>
                    <strong className="text-[#81c784] text-lg">{historyData.length ? Math.max(...historyData.map((item) => item.skorTotal)) : 0}</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-6 shadow-[0_18px_45px_-25px_rgba(0,0,0,0.6)]">
                <p className="text-[0.75rem] uppercase tracking-[0.18em] text-[#e05c2a] font-bold">Catatan</p>
                <ul className="mt-4 space-y-3 text-sm text-[#eae4dd]">
                  <li className="flex gap-3"><span className="text-[#e05c2a]">•</span> Skor di atas 80 menandakan hasil evaluasi sangat baik.</li>
                  <li className="flex gap-3"><span className="text-[#e05c2a]">•</span> Nilai 50–80 memerlukan perbaikan pada beberapa aspek ESG.</li>
                  <li className="flex gap-3"><span className="text-[#e05c2a]">•</span> Modal detail dapat dikembangkan menjadi halaman terpisah sesuai kebutuhan.</li>
                </ul>
              </div>
            </aside>
          </section>
        </div>

      </main>
    </div>
  );
}
