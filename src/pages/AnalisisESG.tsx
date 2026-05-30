import { useEffect, useMemo, useState } from "react";
import type { PageName } from "../App";
import { getAnalysis } from "../lib/analysisCache";

interface AnalisisESGProps {
  navigate: (page: PageName) => void;
  namaUsaha: string;
  idUsaha: number | null;
}

type AnalysisData = {
  usaha?: {
    nama_usaha?: string;
    bidang_usaha?: string;
    alamat?: string;
  };
  dampak?: {
    lingkungan?: string | null;
    sosial?: string | null;
    ekonomi?: string | null;
  };
  skor_esg?: {
    lingkungan?: number | null;
    sosial?: number | null;
    governance?: number | null;
    total?: number | null;
    kategori?: string | null;
    tanggal_perhitungan?: string | null;
  };
  rekomendasi?: string | null;
};

function clampScore(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 0;
  return Math.max(0, Math.min(100, Math.round(Number(value))));
}

function categoryTone(category?: string | null) {
  if (category === "Sangat Baik" || category === "Baik") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (category === "Cukup") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  return "text-rose-300 bg-rose-500/10 border-rose-500/20";
}

function splitRecommendation(text?: string | null) {
  if (!text) return [];
  const parts = text
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return parts.length ? parts : [text];
}

export default function AnalisisESG({ navigate, namaUsaha, idUsaha }: AnalisisESGProps) {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalysis() {
      if (!idUsaha) {
        setError("Pilih usaha yang sudah diverifikasi dari dashboard terlebih dahulu.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getAnalysis<AnalysisData>(idUsaha);
        if (cancelled) return;

        if (!data) {
          setError("Belum ada hasil analisis AI untuk usaha ini.");
          return;
        }

        setAnalysis(data);
      } catch {
        if (!cancelled) setError("Gagal memuat hasil analisis dari API Laravel.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadAnalysis();

    return () => {
      cancelled = true;
    };
  }, [idUsaha]);

  const dataAspek = useMemo(
    () => [
      { label: "Lingkungan", skor: clampScore(analysis?.skor_esg?.lingkungan) },
      { label: "Sosial", skor: clampScore(analysis?.skor_esg?.sosial) },
      { label: "Tata Kelola", skor: clampScore(analysis?.skor_esg?.governance) },
    ],
    [analysis],
  );

  const skorUtama = clampScore(analysis?.skor_esg?.total);
  const kategori = analysis?.skor_esg?.kategori ?? "Belum Dikategorikan";
  const rekomendasi = splitRecommendation(analysis?.rekomendasi);
  const displayName = analysis?.usaha?.nama_usaha || namaUsaha || "Usaha";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center font-body text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e05c2a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Memuat hasil analisis AI...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center py-10 px-4 font-body text-white">
        <div className="w-full max-w-md bg-[#3a3a3a] border border-white/5 rounded-[24px] p-8 text-center">
          <h2 className="font-head text-xl font-bold">Analisis Belum Tersedia</h2>
          <p className="mt-3 text-sm text-gray-300">{error}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button onClick={() => navigate("dashboard")} className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-gray-200 hover:bg-white/5">
              Dashboard
            </button>
            <button onClick={() => navigate("step1")} className="flex-1 rounded-xl bg-[#e05c2a] px-4 py-3 text-xs font-bold text-white hover:bg-[#f06b35]">
              Mulai Evaluasi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 font-body antialiased text-white relative overflow-hidden">
      <div className="w-full sm:max-w-xl bg-[#3a3a3a] p-8 sm:p-10 rounded-[24px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] border border-white/5 transition-all relative z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="relative mb-6">
            <h2 className="font-head text-3xl font-black tracking-wide text-white drop-shadow-md truncate max-w-[350px]">{displayName}</h2>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#e05c2a] rounded-full" />
          </div>

          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1 mb-6">Raport Analisis Keberlanjutan</p>

          <div className="inline-flex items-center justify-center bg-[#4a4a4a] p-[1.5px] rounded-2xl shadow-[0_15px_35px_-5px_rgba(0,0,0,0.5)] border border-white/10">
            <div className="flex items-center bg-[#2d2d2d]/90 px-6 py-3 rounded-[15px]">
              <div className="flex items-baseline pr-5 select-none">
                <span className="text-4xl font-black text-[#e05c2a] tracking-tight">{skorUtama}</span>
                <span className="text-xs font-bold text-gray-500 ml-1 tracking-wider uppercase">/100</span>
              </div>
              <div className="w-[1px] h-7 bg-white/15" />
              <div className="pl-5 flex items-center gap-2">
                <span className={`text-xs font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-lg border ${categoryTone(kategori)}`}>{kategori}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t border-white/5 text-left">
          <div className="bg-[#4a4a4a]/50 p-5 rounded-2xl space-y-4 border border-white/5 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#e05c2a]">Rincian Skor Aspek ESG</h4>
              <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Target: 80+</span>
            </div>

            <div className="space-y-4 pt-1">
              {dataAspek.map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-300">{item.label}</span>
                    <span className="text-white font-bold">{item.skor} / 100</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
                    <div className="absolute top-0 left-0 h-full bg-[#e05c2a] rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.skor}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#4a4a4a]/50 p-5 rounded-2xl space-y-3 border border-white/5 shadow-inner">
            <h4 className="text-[12px] font-black uppercase tracking-wider text-[#e05c2a] border-b border-white/5 pb-2">Rekomendasi AI</h4>
            {rekomendasi.length > 0 ? (
              <ul className="space-y-2.5 text-xs text-gray-200 font-medium leading-relaxed pl-1 pt-1">
                {rekomendasi.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="text-[#e05c2a] font-black text-sm mt-0.5">-</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">Belum ada rekomendasi tersimpan.</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-[#4a4a4a]/50 p-4 rounded-2xl border border-white/5">
              <p className="text-[#e05c2a] font-bold uppercase tracking-wider mb-2">Lingkungan</p>
              <p className="text-gray-200 leading-relaxed">{analysis?.dampak?.lingkungan || "-"}</p>
            </div>
            <div className="bg-[#4a4a4a]/50 p-4 rounded-2xl border border-white/5">
              <p className="text-[#e05c2a] font-bold uppercase tracking-wider mb-2">Sosial</p>
              <p className="text-gray-200 leading-relaxed">{analysis?.dampak?.sosial || "-"}</p>
            </div>
            <div className="bg-[#4a4a4a]/50 p-4 rounded-2xl border border-white/5">
              <p className="text-[#e05c2a] font-bold uppercase tracking-wider mb-2">Ekonomi</p>
              <p className="text-gray-200 leading-relaxed">{analysis?.dampak?.ekonomi || "-"}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button type="button" onClick={() => navigate("step1")} className="w-full sm:w-auto text-center text-xs font-bold text-gray-400 hover:text-white transition-colors py-2 uppercase tracking-wider">
            Evaluasi Ulang
          </button>

          <button type="button" onClick={() => navigate("pengajuan-kredit")} className="w-full sm:w-auto inline-flex items-center justify-center font-bold text-xs px-6 py-4 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer shadow-[0_8px_20px_-4px_rgba(224,92,42,0.4)] tracking-wider uppercase">
            Lanjut Kredit Hijau
          </button>
        </div>
      </div>
    </div>
  );
}
