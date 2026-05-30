import React, { useState } from "react";
import { isAxiosError } from "axios";
import type { BusinessData } from "../App";
import api from "../lib/api";

interface TambahUsahaProps {
  isOpen: boolean;
  onClose: () => void;
  setBusinessList: React.Dispatch<React.SetStateAction<BusinessData[]>>;
  onCreated?: () => Promise<void>;
}

export default function TambahUsaha({ isOpen, onClose, setBusinessList, onCreated }: TambahUsahaProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [namaUsaha, setNamaUsaha] = useState("");
  const [pemilik, setPemilik] = useState("");
  const [bidangUsaha, setBidangUsaha] = useState("");
  const [kota, setKota] = useState("");
  const [ktp, setKtp] = useState<File | null>(null);
  const [npwp, setNpwp] = useState<File | null>(null);
  const [suratIzinUsaha, setSuratIzinUsaha] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const resetForm = () => {
    setStep(1);
    setError("");
    setNamaUsaha("");
    setPemilik("");
    setBidangUsaha("");
    setKota("");
    setKtp(null);
    setNpwp(null);
    setSuratIzinUsaha(null);
  };

  const handleDirectSubmit = async () => {
    if (!namaUsaha.trim() || !bidangUsaha.trim() || !kota.trim()) {
      setError("Nama usaha, bidang usaha, dan lokasi wajib diisi.");
      setStep(namaUsaha.trim() ? 2 : 1);
      return;
    }

    if (!ktp || !npwp || !suratIzinUsaha) {
      setError("KTP, NPWP, dan NIB/SIUP wajib diunggah.");
      setStep(3);
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const payload = new FormData();
      payload.append("nama_usaha", namaUsaha.trim());
      payload.append("bidang_usaha", bidangUsaha.trim());
      payload.append("alamat", `${kota.trim()}${pemilik.trim() ? ` - Pemilik: ${pemilik.trim()}` : ""}`);
      payload.append("ktp", ktp);
      payload.append("npwp", npwp);
      payload.append("surat_izin_usaha", suratIzinUsaha);

      const response = await api.post<{
        data: {
          usaha: {
            id_usaha: number;
            nama_usaha: string;
            bidang_usaha: string;
            alamat: string;
          };
          dokumen: {
            status_verifikasi: string;
            tanggal_registrasi: string;
          };
        };
      }>("/usaha", payload);

      const opsiTanggal: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
      const tanggal = new Date(response.data.data.dokumen.tanggal_registrasi).toLocaleDateString("id-ID", opsiTanggal);

      const newBusiness: BusinessData = {
        id: String(response.data.data.usaha.id_usaha),
        idUsaha: response.data.data.usaha.id_usaha,
        namaUsaha: response.data.data.usaha.nama_usaha,
        bidangUsaha: response.data.data.usaha.bidang_usaha,
        alamat: response.data.data.usaha.alamat,
        tanggalDiajukan: tanggal,
        status: "Dalam Proses",
        rawStatus: response.data.data.dokumen.status_verifikasi,
      };

      setBusinessList((prevList) => [...prevList, newBusiness]);

      resetForm();
      onClose();

      const refresh = onCreated?.();
      if (refresh) void refresh.catch(() => undefined);
    } catch (err) {
      let message = "Gagal mengajukan usaha. Pastikan Anda sudah login.";

      if (isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(err)) {
        const errors = err.response?.data.errors;
        message = errors ? Object.values(errors)[0]?.[0] ?? message : err.response?.data.message ?? message;
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const fileBox = (label: string, hint: string, file: File | null, onChange: (file: File | null) => void) => (
    <label className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-[#e05c2a]/40 bg-white/[0.01] transition-colors cursor-pointer block">
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      <span className="block text-[0.78rem] font-bold text-white">{label}</span>
      <span className="block text-[0.65rem] text-[#b0a89e] mt-1 truncate">{file ? file.name : hint}</span>
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={handleClose} />

      <div className="relative w-full max-w-2xl bg-[#2d2d2d] border border-white/10 rounded-[24px] p-6 md:p-8 shadow-2xl text-[#f0ece8]">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="font-head text-xl font-bold text-white">Registrasi & Unggah Dokumen</h2>
            <p className="text-[0.8rem] text-[#b0a89e] mt-0.5">Daftarkan identitas usaha Anda untuk proses verifikasi.</p>
          </div>
          <div className="text-[0.75rem] font-bold bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full text-[#b0a89e]">
            Langkah <span className="text-[#e05c2a]">{step}</span> dari 3
          </div>
        </div>

        <div className="w-full bg-white/[0.05] h-1 rounded-full mb-6 overflow-hidden">
          <div className="bg-[#e05c2a] h-full transition-all duration-300 ease-in-out" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        <div className="space-y-5">
          {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-[#b0a89e] tracking-wider uppercase">Nama Usaha / Perusahaan</label>
                <input type="text" placeholder="Contoh: CV Sinar Abadi" value={namaUsaha} onChange={(e) => setNamaUsaha(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#e05c2a] focus:outline-none transition-all text-[0.9rem]" />
              </div>
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-[#b0a89e] tracking-wider uppercase">Nama Pemilik / Direktur Utama</label>
                <input type="text" placeholder="Nama lengkap sesuai KTP" value={pemilik} onChange={(e) => setPemilik(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#e05c2a] focus:outline-none transition-all text-[0.9rem]" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-[#b0a89e] tracking-wider uppercase">Bidang Usaha / Sektor</label>
                <input type="text" placeholder="Contoh: Manufaktur, Kuliner" value={bidangUsaha} onChange={(e) => setBidangUsaha(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#e05c2a] focus:outline-none transition-all text-[0.9rem]" />
              </div>
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-[#b0a89e] tracking-wider uppercase">Kota / Kabupaten Operasional</label>
                <input type="text" placeholder="Lokasi pabrik/kantor utama" value={kota} onChange={(e) => setKota(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#e05c2a] focus:outline-none transition-all text-[0.9rem]" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <label className="text-[0.75rem] font-bold text-[#b0a89e] tracking-wider uppercase block">Dokumen Validasi Legalitas (.pdf / .jpg)</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {fileBox("Upload KTP", "Pilih file KTP", ktp, setKtp)}
                {fileBox("NPWP Bisnis", "Pilih file NPWP", npwp, setNpwp)}
                {fileBox("NIB / SIUP", "Pilih file izin usaha", suratIzinUsaha, setSuratIzinUsaha)}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-white/[0.06] mt-6">
            <button type="button" onClick={step === 1 ? handleClose : handleBack} className="text-[0.85rem] font-bold text-[#b0a89e] hover:text-white transition-colors cursor-pointer">
              {step === 1 ? "Batal" : "Kembali"}
            </button>

            {step < 3 ? (
              <button type="button" onClick={handleNext} className="inline-flex items-center justify-center font-bold text-[0.85rem] px-5 py-2.5 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all cursor-pointer">
                Lanjutkan
              </button>
            ) : (
              <button type="button" onClick={handleDirectSubmit} disabled={isSubmitting} className="inline-flex items-center justify-center font-bold text-[0.85rem] px-5 py-2.5 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer">
                {isSubmitting ? "Mengajukan..." : "Ajukan Dokumen Usaha"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
