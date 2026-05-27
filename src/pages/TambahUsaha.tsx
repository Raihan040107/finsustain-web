import React, { useState } from "react";
import type { BusinessData } from "../App";

interface TambahUsahaProps {
  isOpen: boolean;
  onClose: () => void;
  setBusinessList: React.Dispatch<React.SetStateAction<BusinessData[]>>; 
}

export default function TambahUsaha({ isOpen, onClose, setBusinessList }: TambahUsahaProps) {
  const [step, setStep] = useState(1);

  // State isi form
  const [namaUsaha, setNamaUsaha] = useState("");
  const [pemilik, setPemilik] = useState("");
  const [bidangUsaha, setBidangUsaha] = useState("");
  const [kota, setKota] = useState("");

  if (!isOpen) return null;

  const handleNext = () => { if (step < 3) setStep(step + 1); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };

  const handleDirectSubmit = () => {
    console.log("Aman! Tombol 'Ajukan Dokumen Usaha' berhasil di-klik.");

    const finalNamaUsaha = namaUsaha.trim() || "PT Sinar Mandiri (Testing)";
    
    const opsiTanggal: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    const tanggalHariIni = new Date().toLocaleDateString("id-ID", opsiTanggal);

    const newBusiness: BusinessData = {
      id: Date.now().toString(),
      namaUsaha: finalNamaUsaha,
      tanggalDiajukan: tanggalHariIni,
      status: "Dalam Proses", // Sesuai dengan spesifikasi type BusinessData di App.tsx
    };

    if (typeof setBusinessList === "function") {
      setBusinessList((prevList) => [...prevList, newBusiness]);
      console.log("Berhasil push data ke state global dashboard!");
    } else {
      console.error("Waduh! setBusinessList pecah / gak kebaca sebagai fungsi di komponen TambahUsaha.");
    }
    
    // Reset dan tutup modal
    setStep(1);
    setNamaUsaha("");
    setPemilik("");
    setBidangUsaha("");
    setKota("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#2d2d2d] border border-white/10 rounded-[24px] p-6 md:p-8 shadow-2xl text-[#f0ece8]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="font-head text-xl font-bold text-white">Registrasi & Unggah Dokumen</h2>
            <p className="text-[0.8rem] text-[#b0a89e] mt-0.5">Daftarkan identitas usaha Anda untuk proses verifikasi.</p>
          </div>
          <div className="text-[0.75rem] font-bold bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full text-[#b0a89e]">
            Langkah <span className="text-[#e05c2a]">{step}</span> dari 3
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-white/[0.05] h-1 rounded-full mb-6 overflow-hidden">
          <div
            className="bg-[#e05c2a] h-full transition-all duration-300 ease-in-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="space-y-5">
          
          {/* STEP 1: NAMA USAHA & PEMILIK */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-[#b0a89e] tracking-wider uppercase">Nama Usaha / Perusahaan</label>
                <input 
                  type="text" 
                  placeholder="Contoh: CV Sinar Abadi (Boleh kosong pas testing)"
                  value={namaUsaha}
                  onChange={(e) => setNamaUsaha(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#e05c2a] focus:outline-none transition-all text-[0.9rem]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-[#b0a89e] tracking-wider uppercase">Nama Pemilik / Direktur Utama</label>
                <input 
                  type="text" 
                  placeholder="Nama lengkap sesuai KTP"
                  value={pemilik}
                  onChange={(e) => setPemilik(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#e05c2a] focus:outline-none transition-all text-[0.9rem]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: BIDANG USAHA & KOTA */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-[#b0a89e] tracking-wider uppercase">Bidang Usaha / Sektor</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Manufaktur, Kuliner"
                  value={bidangUsaha}
                  onChange={(e) => setBidangUsaha(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#e05c2a] focus:outline-none transition-all text-[0.9rem]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-[#b0a89e] tracking-wider uppercase">Kota / Kabupaten Operasional</label>
                <input 
                  type="text" 
                  placeholder="Lokasi pabrik/kantor utama"
                  value={kota}
                  onChange={(e) => setKota(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#e05c2a] focus:outline-none transition-all text-[0.9rem]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: UPLOAD BERKAS LEGALITAS */}
          {step === 3 && (
            <div className="space-y-3">
              <label className="text-[0.75rem] font-bold text-[#b0a89e] tracking-wider uppercase block">Dokumen Validasi Legalitas (.pdf / .jpg)</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-[#e05c2a]/40 bg-white/[0.01] transition-colors cursor-pointer">
                  <span className="block text-xl mb-1">🪪</span>
                  <span className="block text-[0.78rem] font-bold text-white">Upload KTP</span>
                  <span className="block text-[0.65rem] text-[#b0a89e] mt-0.5">Maks 5MB</span>
                </div>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-[#e05c2a]/40 bg-white/[0.01] transition-colors cursor-pointer">
                  <span className="block text-xl mb-1">💳</span>
                  <span className="block text-[0.78rem] font-bold text-white">NPWP Bisnis</span>
                  <span className="block text-[0.65rem] text-[#b0a89e] mt-0.5">Maks 5MB</span>
                </div>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-[#e05c2a]/40 bg-white/[0.01] transition-colors cursor-pointer">
                  <span className="block text-xl mb-1">📄</span>
                  <span className="block text-[0.78rem] font-bold text-white">NIB / SIUP</span>
                  <span className="block text-[0.65rem] text-[#b0a89e] mt-0.5">Maks 10MB</span>
                </div>
              </div>
            </div>
          )}

          {/* BUTTON CONTROLS */}
          <div className="flex justify-between items-center pt-4 border-t border-white/[0.06] mt-6">
            <button
              type="button"
              onClick={step === 1 ? onClose : handleBack}
              className="text-[0.85rem] font-bold text-[#b0a89e] hover:text-white transition-colors cursor-pointer"
            >
              {step === 1 ? "Batal" : "← Kembali"}
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center font-bold text-[0.85rem] px-5 py-2.5 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer"
              >
                Lanjutkan →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDirectSubmit}
                className="inline-flex items-center justify-center font-bold text-[0.85rem] px-5 py-2.5 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] hover:shadow-[0_4px_15px_rgba(224,92,42,0.3)] transition-all cursor-pointer"
              >
                Ajukan Dokumen Usaha
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}