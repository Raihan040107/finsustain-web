import React, { useState, useEffect, useMemo } from "react";
import type { PageName } from "../App";
import Toast, { type ToastType } from "../components/ui/Toast";
import api from "../lib/api";

// ── Types ────────────────────────────────────────────────────────────────────

interface OpsiJawaban {
  opsi_id: number;
  label: string;
  teks: string;
  nilai: number;
}

interface Pertanyaan {
  pertanyaan_id: number;
  pertanyaan: string;
  aspek: "environment" | "social" | "governance";
  urutan: number;
  opsi_jawaban: OpsiJawaban[];
}

interface FormPertanyaanProps {
  navigate: (page: PageName) => void;
  step: number;
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

// ── Komponen ──────────────────────────────────────────────────────────────────

export default function FormPertanyaan({ navigate, step }: FormPertanyaanProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [pertanyaan, setPertanyaan] = useState<Pertanyaan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Sinkronisasi step dari router App.tsx
  useEffect(() => {
    if (step >= 1 && step <= 3) setCurrentStep(step);
    else if (step === 4) setCurrentStep(3);
  }, [step]);

  // Fetch pertanyaan + opsi dari API
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const res = await api.get<{ data: Pertanyaan[] }>("/pertanyaan");
        setPertanyaan(res.data.data);
        // Init answers: semua kosong
        const init: Record<number, string> = {};
        res.data.data.forEach((p) => {
          init[p.pertanyaan_id] = "";
        });
        setAnswers(init);
      } catch {
        setError("Gagal memuat pertanyaan. Coba refresh halaman.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
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
      navigate("upload");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    setToast({
      message: "Evaluasi ESG Berhasil Disubmit! Menghitung Skor Anda...",
      type: "success",
    });

    setTimeout(() => {
      navigate("analisis");
    }, 1500);
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
                className="flex-1 inline-flex items-center justify-center font-bold text-xs py-3.5 rounded-xl bg-green-600 text-white hover:bg-green-500 transition-all cursor-pointer shadow-md uppercase tracking-wider"
              >
                Submit Evaluasi ✔
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
