import { useEffect, useState } from "react";
import type { PageName } from "../App";
import { getAnalysis } from "../lib/analysisCache";

interface PengajuanKreditHijauProps {
  navigate: (page: PageName) => void;
  namaUsaha: string;
  idUsaha: number | null;
}

type AnalysisData = {
  usaha?: {
    nama_usaha?: string;
  };
  skor_esg?: {
    total?: number | null;
    kategori?: string | null;
  };
  pengajuan?: {
    jumlah_pinjaman?: number | null;
    tenor_bulanan?: number | null;
    tingkat_bunga_khusus?: number | null;
    syarat_esg?: string | null;
  };
  rekomendasi?: string | null;
};

function rupiah(value?: number | null) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export default function PengajuanKreditHijau({ navigate, namaUsaha, idUsaha }: PengajuanKreditHijauProps) {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalysis() {
      if (!idUsaha) {
        setError("Pilih usaha dari dashboard terlebih dahulu.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getAnalysis<AnalysisData>(idUsaha);
        if (cancelled) return;

        if (!data) {
          setError("Belum ada rekomendasi kredit dari analisis AI.");
          return;
        }

        setAnalysis(data);
      } catch {
        if (!cancelled) setError("Gagal memuat rekomendasi kredit dari API Laravel.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadAnalysis();

    return () => {
      cancelled = true;
    };
  }, [idUsaha]);

  const displayName = analysis?.usaha?.nama_usaha || namaUsaha || "Usaha";
  const pengajuan = analysis?.pengajuan;
  const score = Math.round(Number(analysis?.skor_esg?.total ?? 0));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center font-body text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e05c2a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Memuat rekomendasi kredit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center py-10 px-4 font-body text-white">
        <div className="w-full max-w-md bg-[#3a3a3a] border border-white/5 rounded-[24px] p-8 text-center">
          <h2 className="font-head text-xl font-bold">Rekomendasi Belum Tersedia</h2>
          <p className="mt-3 text-sm text-gray-300">{error}</p>
          <button onClick={() => navigate("analisis")} className="mt-6 rounded-xl bg-[#e05c2a] px-5 py-3 text-xs font-bold text-white hover:bg-[#f06b35]">
            Kembali ke Analisis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 font-body antialiased text-white relative overflow-hidden">
      <div className="w-full max-w-4xl bg-[#3a3a3a] p-6 sm:p-10 rounded-[24px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] border border-white/5 transition-all relative z-10 text-left">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="relative mb-3">
            <h2 className="font-head text-3xl font-black tracking-wide text-white drop-shadow-md uppercase">Pengajuan Kredit Hijau</h2>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#e05c2a] rounded-full" />
          </div>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-2">
            Rekomendasi AI untuk {displayName}
          </p>
        </div>

        <div className="bg-[#4a4a4a]/40 p-7 rounded-2xl border border-white/5 shadow-inner space-y-7">
          <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#e05c2a]">Detail Rekomendasi Kredit</h3>
            <span className="text-xs font-bold text-gray-300">Skor ESG: {score} / 100</span>
          </div>

          <div className="space-y-6">
            <div className="bg-[#2d2d2d]/60 p-6 rounded-2xl border border-white/5">
              <span className="text-[10px] text-[#b0a89e] font-bold uppercase tracking-wider block mb-2">Plafon Kredit Direkomendasikan</span>
              <span className="text-3xl md:text-4xl font-black text-[#e05c2a] tracking-tight block">{rupiah(pengajuan?.jumlah_pinjaman)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#2d2d2d]/40 p-5 rounded-2xl border border-white/5">
                <span className="text-[9px] text-[#b0a89e] font-bold uppercase tracking-wider block mb-2">Tenor Direkomendasikan</span>
                <span className="text-sm font-extrabold text-white">{pengajuan?.tenor_bulanan ?? 0} Bulan</span>
              </div>
              <div className="bg-[#2d2d2d]/40 p-5 rounded-2xl border border-white/5">
                <span className="text-[9px] text-[#b0a89e] font-bold uppercase tracking-wider block mb-2">Suku Bunga Khusus</span>
                <span className="text-sm font-extrabold text-emerald-400">{pengajuan?.tingkat_bunga_khusus ?? 0}%</span>
              </div>
            </div>

            <div className="bg-[#2d2d2d]/40 p-5 rounded-2xl border border-white/5">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#e05c2a]">Syarat ESG</span>
              <p className="mt-3 text-sm leading-relaxed text-[#b0a89e]">{pengajuan?.syarat_esg || analysis?.rekomendasi || "Belum ada syarat tambahan dari analisis AI."}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button type="button" onClick={() => navigate("analisis")} className="w-full sm:w-auto text-center text-xs font-bold text-[#b0a89e] hover:text-white transition-colors py-3 uppercase tracking-wider">
            Lihat Skor ESG
          </button>

          <button type="button" onClick={() => navigate("dashboard")} className="w-full sm:w-auto inline-flex items-center justify-center font-bold text-xs px-8 py-4 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer shadow-[0_8px_20px_-4px_rgba(224,92,42,0.4)] tracking-wider uppercase">
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
