import type { PageName } from "../App";

interface FormPertanyaanProps {
  navigate: (page: PageName) => void;
  step: 1 | 2 | 3 | 4;
}

export default function FormPertanyaan({ navigate, step }: FormPertanyaanProps) {
  
  const handleNext = () => {
    if (step === 1) navigate("step2");
    else if (step === 2) navigate("step3");
    else if (step === 3) navigate("step4");
    else if (step === 4) {
      alert("Pengajuan Berhasil Dikirim dan Disimpan!");
      // Selesai kuisioner, balikkan user ke halaman Dashboard utama
      navigate("dashboard");
    }
  };

  const handleBack = () => {
    if (step === 1) navigate("upload");
    else if (step === 2) navigate("step1");
    else if (step === 3) navigate("step2");
    else if (step === 4) navigate("step3");
  };

  // Menghitung lebar progres bar kuisioner
  const progressPercent = step * 25;

  return (
    <div className="min-h-screen bg-gray-50 text-[#1a1a1a] font-body antialiased flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto bg-white p-8 rounded-[24px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
        
        {/* Atas: Progres Indikator */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#e05c2a]">Evaluasi Pilar ESG</span>
          <span className="text-xs text-gray-400 font-bold">Langkah {step} dari 4</span>
        </div>
        
        {/* Batang Progres Visual */}
        <div className="w-full bg-gray-100 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-[#e05c2a] h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Isi Pertanyaan */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-black font-head tracking-tight text-gray-900">Pertanyaan Tahap Ke-{step}</h3>
          <p className="text-[1rem] text-gray-600 leading-relaxed font-normal">
            {step === 1 && "Apakah bisnis Anda memiliki mekanisme pencatatan konsumsi daya listrik bulanan dan upaya konversi ke arah energi baru terbarukan (seperti solar panel)?"}
            {step === 2 && "Bagaimana sistem pengelolaan limbah sisa operasional di tempat Anda? Apakah sudah bermitra dengan pihak ketiga pengolah daur ulang tersertifikasi?"}
            {step === 3 && "Apakah perusahaan menjamin perlindungan upah setara, keselamatan kerja (K3), serta keterlibatan aktif komunitas masyarakat sekitar?"}
            {step === 4 && "Apakah usaha Anda memiliki struktur kepemimpinan yang transparan, anti-korupsi, serta pelaporan pajak badan usaha yang rutin & patuh?"}
          </p>

          {/* Opsi Pilihan Jawaban */}
          <div className="space-y-2.5 pt-2">
            {["Ya, sudah berjalan sepenuhnya dengan bukti dokumen syah", "Sedang dalam proses perencanaan dan implementasi bertahap", "Belum menerapkan karena kendala teknis / pendanaan operasional"].map((opsi, index) => (
              <label key={index} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#e05c2a] bg-gray-50/50 cursor-pointer transition-all">
                <input type="radio" name="jawaban" className="accent-[#e05c2a] w-4 h-4 shrink-0" defaultChecked={index === 0} />
                <span className="text-sm font-semibold text-gray-700">{opsi}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tombol Aksi Navigasi Bawah */}
        <div className="flex justify-between gap-4 pt-5 border-t border-gray-100">
          <button 
            onClick={handleBack}
            className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-50 transition-all cursor-pointer"
          >
            ← Kembali
          </button>
          <button 
            onClick={handleNext}
            className="px-7 py-3 rounded-xl bg-[#2d3139] hover:bg-black text-white text-sm font-bold transition-all cursor-pointer shadow-sm"
          >
            {step === 4 ? "Selesai & Kirim ✓" : "Lanjut →"}
          </button>
        </div>

      </div>
    </div>
  );
}