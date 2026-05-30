import React, { useState, useEffect, useMemo } from "react";
import { isAxiosError } from "axios";
import type { PageName } from "../App";
import Toast, { type ToastType } from "../components/ui/Toast";
import api from "../lib/api";
import { invalidateAnalysisCache, setCachedAnalysis } from "../lib/analysisCache";
import { getPertanyaan, type Pertanyaan } from "../lib/pertanyaanCache";

// ── Types ────────────────────────────────────────────────────────────────────

interface FormPertanyaanProps {
  navigate: (page: PageName) => void;
  step: number;
  idUsaha: number | null;
  refreshBusinessList?: () => Promise<void>;
}

// ── Label aspek ───────────────────────────────────────────────────────────────

const ASPEK_CONFIG = {
  environment: {
    label: "🌿 Aspek Lingkungan (Environmental)",
    desc: "Evaluasi penggunaan energi, emisi, dan pengelolaan limbah usaha Anda.",
    step: 1,
  },
  social: {
    label: "🤝 Aspek Sosial (Social)",
    desc: "Evaluasi hubungan tenaga kerja, keselamatan kerja, dan dampak komunitas.",
    step: 2,
  },
  governance: {
    label: "🏢 Aspek Tata Kelola (Governance)",
    desc: "Evaluasi legalitas perizinan, struktur bisnis, dan pembukuan finansial.",
    step: 3,
  },
} as const;

const ASPEK_ORDER: Array<keyof typeof ASPEK_CONFIG> = ["environment", "social", "governance"];

function routeStepToCurrentStep(step: number) {
  if (step >= 1 && step <= 3) return step;
  return 3;
}

// ── Komponen ──────────────────────────────────────────────────────────────────

export default function FormPertanyaan({ navigate, step, idUsaha, refreshBusinessList }: FormPertanyaanProps) {
  const [currentStep, setCurrentStep] = useState(() => routeStepToCurrentStep(step));
  const [pertanyaan, setPertanyaan] = useState<Pertanyaan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Fetch pertanyaan + opsi dari API
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        const data = await getPertanyaan();
        if (cancelled) return;

        setPertanyaan(data);
        // Init answers: semua kosong
        const init = Object.fromEntries(data.map((p) => [p.pertanyaan_id, ""])) as Record<number, string>;
        setAnswers(init);
      } catch {
        if (!cancelled) setError("Gagal memuat pertanyaan. Coba refresh halaman.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // Kelompokkan pertanyaan per aspek
  const grouped = useMemo(() => {
    const map: Record<string, Pertanyaan[]> = {
      environment: [],
      social: [],
      governance: [],
    };
    pertanyaan.forEach((p) => {
      map[p.aspek]?.push(p);
    });
    return map;
  }, [pertanyaan]);

  // Aspek saat ini berdasarkan step
  const currentAspek = ASPEK_ORDER[currentStep - 1];
  const currentPertanyaan = grouped[currentAspek] ?? [];

  // Hitung nomor soal global (biar tetap 1-12 di semua step)
  const globalOffset = useMemo(() => {
    let offset = 0;
    for (let i = 0; i < currentStep - 1; i++) {
      offset += grouped[ASPEK_ORDER[i]]?.length ?? 0;
    }
    return offset;
  }, [currentStep, grouped]);

  const handleRadioChange = (pertanyaanId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [pertanyaanId]: value }));
  };

  // Cek apakah semua soal di satu aspek sudah dijawab
  const isAspekComplete = (aspek: string) => {
    return (grouped[aspek] ?? []).every((p) => answers[p.pertanyaan_id] !== "");
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idUsaha) {
      setToast({
        message: "Pilih usaha yang sudah diverifikasi dari dashboard terlebih dahulu.",
        type: "warning",
      });
      navigate("dashboard");
      return;
    }

    // Validasi global: semua aspek harus lengkap
    const incompleteStep = ASPEK_ORDER.findIndex((a) => !isAspekComplete(a));

    if (incompleteStep !== -1) {
      const aspekName = ["Lingkungan", "Sosial", "Tata Kelola"][incompleteStep];
      setCurrentStep(incompleteStep + 1);
      setToast({
        message: `Silakan lengkapi pertanyaan di aspek ${aspekName} terlebih dahulu!`,
        type: "warning",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setIsSubmitting(true);

      const jawaban = pertanyaan.map((p) => {
        const selectedLabel = answers[p.pertanyaan_id];
        const selectedOption = p.opsi_jawaban.find((opsi) => opsi.label === selectedLabel);

        return {
          pertanyaan_id: p.pertanyaan_id,
          jawaban: selectedOption ? `${selectedOption.label}. ${selectedOption.teks}` : selectedLabel,
        };
      });

      const res = await api.post<{ ai_success: boolean; message: string; ai_message?: string; gemini_analysis?: unknown }>("/jawaban", {
        id_usaha: idUsaha,
        jawaban,
      });

      if (!res.data.ai_success) {
        setToast({
          message: res.data.ai_message ?? res.data.message,
          type: "warning",
        });
        return;
      }

      if (res.data.gemini_analysis) {
        setCachedAnalysis(idUsaha, res.data.gemini_analysis);
      } else {
        invalidateAnalysisCache(idUsaha);
      }

      setToast({
        message: "Evaluasi ESG berhasil dianalisis.",
        type: "success",
      });

      const refresh = refreshBusinessList?.();
      if (refresh) void refresh.catch(() => undefined);

      navigate("analisis");
    } catch (err) {
      let message = "Gagal submit evaluasi. Pastikan usaha sudah diverifikasi admin.";

      if (isAxiosError<{ message?: string }>(err)) {
        message = err.response?.data.message ?? message;
      }

      setToast({
        message,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center font-body">
        <div className="text-center text-white">
          <div className="w-10 h-10 border-4 border-[#e05c2a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Memuat pertanyaan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center font-body px-6">
        <div className="text-center text-white max-w-sm">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 rounded-xl bg-[#e05c2a] text-white text-xs font-bold">
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // ── Render utama ───────────────────────────────────────────────────────────

  const config = ASPEK_CONFIG[currentAspek];

  return (
    <div className="min-h-screen bg-[#2d2d2d] flex flex-col justify-center py-12 px-6 lg:px-8 font-body antialiased text-white relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="sm:mx-auto sm:w-full sm:max-w-xl bg-[#3a3a3a] p-8 md:p-10 rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-white/5">
        {/* Progress indicator */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#e05c2a] bg-[#e05c2a]/10 px-3 py-1.5 rounded-full border border-[#e05c2a]/20">Langkah {currentStep} dari 3 Aspek</span>

          {/* Progress bar */}
          <div className="mt-4 flex gap-1.5 justify-center">
            {ASPEK_ORDER.map((aspek, i) => (
              <div key={aspek} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i + 1 < currentStep ? "bg-green-500" : i + 1 === currentStep ? "bg-[#e05c2a]" : "bg-white/10"}`} />
            ))}
          </div>

          <h2 className="font-head text-2xl font-black tracking-tight text-white mt-4">{config.label}</h2>
          <p className="mt-1.5 text-xs text-gray-400 font-medium">{config.desc}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 text-left">
          {currentPertanyaan.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">Belum ada pertanyaan untuk aspek ini.</p>
          ) : (
            currentPertanyaan.map((p, idx) => (
              <div key={p.pertanyaan_id} className="space-y-3">
                <label className="block text-sm font-bold text-gray-200">
                  {globalOffset + idx + 1}. {p.pertanyaan}
                </label>

                {p.opsi_jawaban.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">Belum ada opsi jawaban.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {p.opsi_jawaban.map((opsi) => {
                      const isSelected = answers[p.pertanyaan_id] === opsi.label;
                      return (
                        <label
                          key={opsi.opsi_id}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected ? "bg-[#e05c2a]/10 border-[#e05c2a]" : "bg-[#4a4a4a] border-white/5 hover:border-white/10"
                          }`}
                        >
                          <input type="radio" name={`q${p.pertanyaan_id}`} checked={isSelected} onChange={() => handleRadioChange(p.pertanyaan_id, opsi.label)} className="accent-[#e05c2a] w-4 h-4" />
                          <span className="text-xs font-semibold text-gray-200">
                            <span className="text-[#e05c2a] mr-1.5">{opsi.label}.</span>
                            {opsi.teks}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}

          {/* Tombol navigasi */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 text-center font-bold text-xs py-3.5 rounded-xl bg-transparent border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer uppercase tracking-wider"
            >
              {currentStep === 1 ? "← Kembali" : "← Sebelumnya"}
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 inline-flex items-center justify-center font-bold text-xs py-3.5 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer shadow-md uppercase tracking-wider"
              >
                Selanjutnya →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center font-bold text-xs py-3.5 rounded-xl bg-green-600 text-white hover:bg-green-500 transition-all cursor-pointer shadow-md uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Menganalisis..." : "Submit Evaluasi"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
