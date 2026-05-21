import React, { useState, useEffect } from "react";
import type { PageName } from "../App";

interface FormPertanyaanProps {
  navigate: (page: PageName) => void;
  step: number;
}

export default function FormPertanyaan({ navigate, step }: FormPertanyaanProps) {
  // State posisi aspek internal kuesioner (1 = Environment, 2 = Social, 3 = Governance)
  const [currentStep, setCurrentStep] = useState(1);

  // Efek biar pas awal buka halaman, step-nya langsung sinkron dengan router App.tsx
  useEffect(() => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
    } else if (step === 4) {
      // Jika dari router dikirim step 4, kita set langsung ke halaman final (Governance)
      setCurrentStep(3);
    }
  }, [step]);

  // State untuk menampung jawaban dari 12 pertanyaan ESG
  const [answers, setAnswers] = useState({
    // Aspek Environment
    q1_listrik: "",
    q2_energi: "",
    q3_limbah: "",
    q4_bahanBaku: "",
    // Aspek Social
    q5_karyawan: "",
    q6_lokal: "",
    q7_jaminan: "",
    q8_upah: "",
    // Aspek Governance
    q9_izin: "",
    q10_pembukuan: "",
    q11_rekening: "",
    q12_rencana: ""
  });

  // Handler untuk memperbarui jawaban radio button
  const handleRadioChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  // Navigasi antar halaman kuesioner
  const handleNext = () => {
    if (currentStep === 1) {
      // Validasi singkat halaman 1 sebelum lanjut
      if (!answers.q1_listrik || !answers.q2_energi || !answers.q3_limbah || !answers.q4_bahanBaku) {
        alert("Silakan isi semua pertanyaan di aspek Lingkungan terlebih dahulu!");
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 2) {
      // Validasi singkat halaman 2 sebelum lanjut
      if (!answers.q5_karyawan || !answers.q6_lokal || !answers.q7_jaminan || !answers.q8_upah) {
        alert("Silakan isi semua pertanyaan di aspek Sosial terlebih dahulu!");
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("upload"); // Kembali ke halaman upload jika di step paling awal
    }
  };

  // Handler submit akhir kuesioner
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi halaman ke-3 sebelum submit
    if (!answers.q9_izin || !answers.q10_pembukuan || !answers.q11_rekening || !answers.q12_rencana) {
      alert("Silakan lengkapi semua pertanyaan di aspek Tata Kelola terlebih dahulu!");
      return;
    }
    
    alert("Evaluasi ESG Berhasil Disubmit! Menghitung Skor Anda...");
    // Alur: Pindah ke page analisis untuk menampilkan rapor hasil akhir skor ESG
    navigate("analisis");
  };

  return (
    <div className="min-h-screen bg-[#2d2d2d] flex flex-col justify-center py-12 px-6 lg:px-8 font-body antialiased text-white">
      
      {/* Container Card Utama */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl bg-[#3a3a3a] p-8 md:p-10 rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-white/5">
        
        {/* Indikator Progress Langkah (Rata Tengah) */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#e05c2a] bg-[#e05c2a]/10 px-3 py-1.5 rounded-full border border-[#e05c2a]/20">
            Langkah {currentStep} dari 3 Aspek
          </span>
          <h2 className="font-head text-2xl font-black tracking-tight text-white mt-4">
            {currentStep === 1 && "🌿 Aspek Lingkungan (Environmental)"}
            {currentStep === 2 && "🤝 Aspek Sosial (Social)"}
            {currentStep === 3 && "🏢 Aspek Tata Kelola (Governance)"}
          </h2>
          <p className="mt-1.5 text-xs text-gray-400 font-medium">
            {currentStep === 1 && "Evaluasi penggunaan energi, emisi, and pengelolaan limbah usaha Anda."}
            {currentStep === 2 && "Evaluasi hubungan tenaga kerja, keselamatan kerja, dan dampak komunitas."}
            {currentStep === 3 && "Evaluasi legalitas perizinan, struktur bisnis, dan pembukuan finansial."}
          </p>
        </div>

        {/* Form Pertanyaan Konten (Isinya Rata Kiri) */}
        <form onSubmit={handleSubmit} className="space-y-8 text-left">
          
          {/* STEP 1: ENVIRONMENTAL */}
          {currentStep === 1 && (
            <>
              {/* Pertanyaan 1 */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-200">1. Berapa rata-rata biaya konsumsi listrik operasional usaha Anda per bulan?</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: "q1_a", val: "A", txt: "Besar (> Rp 2 Juta / Bulan)" },
                    { id: "q1_b", val: "B", txt: "Sedang (Rp 500 Ribu - Rp 2 Juta / Bulan)" },
                    { id: "q1_c", val: "C", txt: "Efisien (< Rp 500 Ribu / Bulan)" }
                  ].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${answers.q1_listrik === opt.val ? "bg-[#e05c2a]/10 border-[#e05c2a]" : "bg-[#4a4a4a] border-white/5 hover:border-white/10"}`}>
                      <input type="radio" name="q1" checked={answers.q1_listrik === opt.val} onChange={() => handleRadioChange("q1_listrik", opt.val)} className="accent-[#e05c2a] w-4 h-4" />
                      <span className="text-xs font-semibold text-gray-200">{opt.txt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pertanyaan 2 */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-200">2. Apa sumber energi utama yang dominan digunakan dalam proses produksi / toko?</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: "q2_a", val: "A", txt: "Listrik PLN Murni" },
                    { id: "q2_b", val: "B", txt: "Masih bergantung Generator / Genset BBM" },
                    { id: "q2_c", val: "C", txt: "Sudah kombinasi Energi Terbarukan (Solar Panel / dll)" }
                  ].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${answers.q2_energi === opt.val ? "bg-[#e05c2a]/10 border-[#e05c2a]" : "bg-[#4a4a4a] border-white/5 hover:border-white/10"}`}>
                      <input type="radio" name="q2" checked={answers.q2_energi === opt.val} onChange={() => handleRadioChange("q2_energi", opt.val)} className="accent-[#e05c2a] w-4 h-4" />
                      <span className="text-xs font-semibold text-gray-200">{opt.txt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pertanyaan 3 */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-200">3. Bagaimana sistem pengelolaan sampah atau sisa limbah operasional Anda?</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: "q3_a", val: "A", txt: "Langsung dibuang gabung tanpa dipilah" },
                    { id: "q3_b", val: "B", txt: "Dipilah berdasarkan kategori (Organik/Anorganik)" },
                    { id: "q3_c", val: "C", txt: "Didaur ulang / diolah mandiri bekerjasama dengan bank sampah" }
                  ].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${answers.q3_limbah === opt.val ? "bg-[#e05c2a]/10 border-[#e05c2a]" : "bg-[#4a4a4a] border-white/5 hover:border-white/10"}`}>
                      <input type="radio" name="q3" checked={answers.q3_limbah === opt.val} onChange={() => handleRadioChange("q3_limbah", opt.val)} className="accent-[#e05c2a] w-4 h-4" />
                      <span className="text-xs font-semibold text-gray-200">{opt.txt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pertanyaan 4 */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-200">4. Apakah usaha Anda menerapkan kebijakan kemasan hemat bahan baku eco-friendly?</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: "q4_a", val: "A", txt: "Belum sama sekali (masih plastik konvensional)" },
                    { id: "q4_b", val: "B", txt: "Sudah mulai mengurangi, beralih ke paperbag / totebag" },
                    { id: "q4_c", val: "C", txt: "Sudah tersertifikasi ramah lingkungan secara menyeluruh" }
                  ].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${answers.q4_bahanBaku === opt.val ? "bg-[#e05c2a]/10 border-[#e05c2a]" : "bg-[#4a4a4a] border-white/5 hover:border-white/10"}`}>
                      <input type="radio" name="q4" checked={answers.q4_bahanBaku === opt.val} onChange={() => handleRadioChange("q4_bahanBaku", opt.val)} className="accent-[#e05c2a] w-4 h-4" />
                      <span className="text-xs font-semibold text-gray-200">{opt.txt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 2: SOCIAL */}
          {currentStep === 2 && (
            <>
              {/* Pertanyaan 5 */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-200">5. Berapa total jumlah karyawan atau mitra kerja aktif di usaha Anda saat ini?</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: "q5_a", val: "A", txt: "Mikro (1 - 5 Orang)" },
                    { id: "q5_b", val: "B", txt: "Kecil (6 - 20 Orang)" },
                    { id: "q5_c", val: "C", txt: "Menengah (> 20 Orang)" }
                  ].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${answers.q5_karyawan === opt.val ? "bg-[#e05c2a]/10 border-[#e05c2a]" : "bg-[#4a4a4a] border-white/5 hover:border-white/10"}`}>
                      <input type="radio" name="q5" checked={answers.q5_karyawan === opt.val} onChange={() => handleRadioChange("q5_karyawan", opt.val)} className="accent-[#e05c2a] w-4 h-4" />
                      <span className="text-xs font-semibold text-gray-200">{opt.txt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pertanyaan 6 */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-200">6. Berapa persentase penyerapan tenaga kerja lokal dari wilayah sekitar tempat usaha?</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: "q6_a", val: "A", txt: "Rendah (< 50% dari total staf)" },
                    { id: "q6_b", val: "B", txt: "Sangat Baik (50% - 80% warga lokal)" },
                    { id: "q6_c", val: "C", txt: "Prioritas Penuh (> 80% memberdayakan masyarakat sekitar)" }
                  ].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${answers.q6_lokal === opt.val ? "bg-[#e05c2a]/10 border-[#e05c2a]" : "bg-[#4a4a4a] border-white/5 hover:border-white/10"}`}>
                      <input type="radio" name="q6" checked={answers.q6_lokal === opt.val} onChange={() => handleRadioChange("q6_lokal", opt.val)} className="accent-[#e05c2a] w-4 h-4" />
                      <span className="text-xs font-semibold text-gray-200">{opt.txt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pertanyaan 7 */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-200">7. Apakah usaha Anda menyediakan jaminan keselamatan kesehatan (BPJS) bagi karyawan?</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: "q7_a", val: "A", txt: "Belum tersedia" },
                    { id: "q7_b", val: "B", txt: "Hanya jaminan santunan kasual tidak formal jika terjadi musibah" },
                    { id: "q7_c", val: "C", txt: "Sudah terdaftar jaminan kesehatan resmi (BPJS / Asuransi Staf)" }
                  ].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${answers.q7_jaminan === opt.val ? "bg-[#e05c2a]/10 border-[#e05c2a]" : "bg-[#4a4a4a] border-white/5 hover:border-white/10"}`}>
                      <input type="radio" name="q7" checked={answers.q7_jaminan === opt.val} onChange={() => handleRadioChange("q7_jaminan", opt.val)} className="accent-[#e05c2a] w-4 h-4" />
                      <span className="text-xs font-semibold text-gray-200">{opt.txt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pertanyaan 8 */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-200">8. Bagaimana penataan regulasi jam kerja dan kesepakatan upah lembur karyawan?</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: "q8_a", val: "A", txt: "Belum terstruktur secara formal (fleksibel mengikuti kondisi pasar)" },
                    { id: "q8_b", val: "B", txt: "Jam kerja tetap teratur namun bonus lemburan belum dihitung detail" },
                    { id: "q8_c", val: "C", txt: "Sudah memiliki sistem shift berkontrak tertulis yang disepakati layak" }
                  ].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${answers.q8_upah === opt.val ? "bg-[#e05c2a]/10 border-[#e05c2a]" : "bg-[#4a4a4a] border-white/5 hover:border-white/10"}`}>
                      <input type="radio" name="q8" checked={answers.q8_upah === opt.val} onChange={() => handleRadioChange("q8_upah", opt.val)} className="accent-[#e05c2a] w-4 h-4" />
                      <span className="text-xs font-semibold text-gray-200">{opt.txt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 3: GOVERNANCE */}
          {currentStep === 3 && (
            <>
              {/* Pertanyaan 9 */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-200">9. Apa tingkat legalitas perizinan usaha resmi yang saat ini sudah Anda kantongi?</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: "q9_a", val: "A", txt: "Belum berizin resmi dagang" },
                    { id: "q9_b", val: "B", txt: "Sudah memiliki NIB (Nomor Induk Berusaha) tingkat dasar" },
                    { id: "q9_c", val: "C", txt: "Lengkap (NIB, SIUP, NPWP Badan, atau Sertifikasi Halal/terkait)" }
                  ].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${answers.q9_izin === opt.val ? "bg-[#e05c2a]/10 border-[#e05c2a]" : "bg-[#4a4a4a] border-white/5 hover:border-white/10"}`}>
                      <input type="radio" name="q9" checked={answers.q9_izin === opt.val} onChange={() => handleRadioChange("q9_izin", opt.val)} className="accent-[#e05c2a] w-4 h-4" />
                      <span className="text-xs font-semibold text-gray-200">{opt.txt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pertanyaan 10 */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-200">10. Bagaimana metode pencatatan arus keuangan kas harian usaha dilakukan?</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: "q10_a", val: "A", txt: "Dicatat manual di buku nota fisik biasa" },
                    { id: "q10_b", val: "B", txt: "Rekap mingguan / bulanan menggunakan spreadsheet Excel biasa" },
                    { id: "q10_c", val: "C", txt: "Sudah mengadopsi Aplikasi Pembukuan Finansial Digital khusus UMKM" }
                  ].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${answers.q10_pembukuan === opt.val ? "bg-[#e05c2a]/10 border-[#e05c2a]" : "bg-[#4a4a4a] border-white/5 hover:border-white/10"}`}>
                      <input type="radio" name="q10" checked={answers.q10_pembukuan === opt.val} onChange={() => handleRadioChange("q10_pembukuan", opt.val)} className="accent-[#e05c2a] w-4 h-4" />
                      <span className="text-xs font-semibold text-gray-200">{opt.txt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pertanyaan 11 */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-200">11. Apakah aset keuangan kas pribadi Anda terpisah rapi dengan kas operasional toko?</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: "q11_a", val: "A", txt: "Masih tercampur baur dalam satu rekening bank pribadi" },
                    { id: "q11_b", val: "B", txt: "Mayoritas terpisah namun pencatatan pengambilannya belum kaku" },
                    { id: "q11_c", val: "C", txt: "Terpisah 100% mutlak dengan pembukuan kas yang profesional" }
                  ].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${answers.q11_rekening === opt.val ? "bg-[#e05c2a]/10 border-[#e05c2a]" : "bg-[#4a4a4a] border-white/5 hover:border-white/10"}`}>
                      <input type="radio" name="q11" checked={answers.q11_rekening === opt.val} onChange={() => handleRadioChange("q11_rekening", opt.val)} className="accent-[#e05c2a] w-4 h-4" />
                      <span className="text-xs font-semibold text-gray-200">{opt.txt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pertanyaan 12 */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-200">12. Apakah usaha Anda memiliki target rencana tertulis jangka pendek maupun pembagian tugas?</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { id: "q12_a", val: "A", txt: "Tidak ada (usaha berjalan mengalir natural saja)" },
                    { id: "q12_b", val: "B", txt: "Ada rencana tertulis sederhana namun belum dievaluasi rutin berkala" },
                    { id: "q12_c", val: "C", txt: "Memiliki struktur organisasi dan target bisnis bulanan yang jelas" }
                  ].map((opt) => (
                    <label key={opt.id} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${answers.q12_rencana === opt.val ? "bg-[#e05c2a]/10 border-[#e05c2a]" : "bg-[#4a4a4a] border-white/5 hover:border-white/10"}`}>
                      <input type="radio" name="q12" checked={answers.q12_rencana === opt.val} onChange={() => handleRadioChange("q12_rencana", opt.val)} className="accent-[#e05c2a] w-4 h-4" />
                      <span className="text-xs font-semibold text-gray-200">{opt.txt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Tombol Aksi Navigasi Form Bawah */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/5">
            {/* Tombol Kembali / Back */}
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 text-center font-bold text-xs py-3.5 rounded-xl bg-transparent border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer uppercase tracking-wider"
            >
              {currentStep === 1 ? "← Kembali" : "← Sebelumnya"}
            </button>

            {/* Tombol Lanjut (Langkah 1 & 2) atau Submit Akhir (Langkah 3) */}
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