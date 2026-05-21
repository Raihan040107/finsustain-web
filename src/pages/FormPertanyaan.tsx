import { useState } from "react";
import type { PageName } from "../App";
import Modal from "../components/ui/Modal";

const LogoSVG = () => (
  <svg viewBox="0 0 24 24">
    <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 4h2v-2h2v2h2v2h-2v2h-2v-2h-2z" />
  </svg>
);

const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { num: 1, label: "Step 1", name: "Profil & Data" },
    { num: 2, label: "Step 2", name: "Analisis ESG" },
    { num: 3, label: "Step 3", name: "Laporan" },
    { num: 4, label: "Step 4", name: "Kredit Hijau" },
  ];

  return (
    <div className="stepper">
      {steps.map((s, i) => {
        const isDone = s.num < currentStep;
        const isActive = s.num === currentStep;
        return (
          <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "0 0 auto" }}>
            <div className="step-item" style={{ flex: "0 0 auto" }}>
              <div className={`step-bubble ${isDone ? "done" : ""} ${isActive ? "active" : ""}`} style={{ position: "relative" }}>
                <div className="step-info">
                  <div className={`s-num ${isActive || isDone ? "active" : ""}`}>{s.label}</div>
                  <div className="s-name">{s.name}</div>
                </div>
              </div>
            </div>
            {i < steps.length - 1 && <div className={`step-line ${isDone ? "done" : ""}`} style={{ flex: 1 }}></div>}
          </div>
        );
      })}
    </div>
  );
};

export default function FormPertanyaan({ navigate, step }: { navigate: (page: PageName) => void; step: 1 | 2 | 3 | 4 }) {
  const [showModal, setShowModal] = useState(false);

  const goNext = () => {
    const map: Record<number, PageName> = { 1: "step2", 2: "step3", 3: "step4" };
    if (map[step]) navigate(map[step]);
  };

  return (
    <div className="page-step">
      <div className="step-nav">
        <a className="logo" onClick={() => navigate("dashboard")} style={{ cursor: "pointer" }}>
          <div className="logo-icon"><LogoSVG /></div>
          F-Tech Solution
        </a>
        <span className="step-label-right">Evaluasi</span>
      </div>

      <Stepper currentStep={step} />

      <div className="step-content">
        {step === 1 && (
          <div className="step-card">
            <div className="form-section-title">1. Profil Usaha</div>
            <div className="form-grid">
              {["Nama UMKM", "Pengelolaan Limbah", "Penggunaan Listrik Bulanan", "Jumlah Karyawan", "Sumber Energi Utama", "Perizinan Usaha", "Karyawan Lokal"].map((label) => (
                <div key={label} className="form-field">
                  <label>{label}</label>
                  <input type="text" placeholder="" />
                </div>
              ))}
              <div className="form-field">
                <label>Memperkerjakan Perempuan?</label>
                <select>
                  <option value="">Pilih...</option>
                  <option>Ya</option>
                  <option>Tidak</option>
                </select>
              </div>
            </div>
            <div className="step-actions">
              <button className="btn btn-primary" onClick={goNext}>Lanjut ke Analisis →</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-card">
            <div className="esg-card-header">
              <h2>Toko Sinar Mentari</h2>
              <div className="esg-score-label">Skor ESG</div>
              <div><span className="score-big">65</span><span className="score-max"> / 100</span></div>
            </div>
            <div className="esg-body">
              <div className="esg-detail">
                <h4>Rincian :</h4>
                {[{ label: "Lingkungan", val: "26 / 100", pct: 26 }, { label: "Sosial", val: "28 / 100", pct: 28 }, { label: "Tata Kelola", val: "21 / 100", pct: 21 }].map((r) => (
                  <div key={r.label} style={{ marginBottom: "10px" }}>
                    <div className="esg-row" style={{ marginTop: "10px" }}>
                      <span className="cat">{r.label}</span>
                      <span className="val">{r.val}</span>
                    </div>
                    <div className="esg-bar-wrap"><div className="esg-bar" style={{ width: `${r.pct}%` }}></div></div>
                  </div>
                ))}
              </div>
              <div className="esg-rec">
                <h4>Rekomendasi :</h4>
                {["Ganti sumber listrik ke panel surya mini 300W untuk meningkatkan skor GG", "Gunakan pencatatan digital untuk meningkatkan skor GG", "Program pelatihan karyawan 6 jam/bulan"].map((rec) => (
                  <div key={rec} className="rec-item">
                    <div className="rec-dot"></div>
                    <div>{rec}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="step-actions" style={{ marginTop: "28px" }}>
              <button className="btn btn-primary" onClick={goNext}>Lanjut Laporan →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-card">
            <div className="laporan-header"><h2>Laporan Dampak</h2></div>
            <div className="laporan-cols">
              <div className="laporan-col">
                <h4>Lingkungan :</h4>
                {["Pengurangan Emisi: 12%", "Energi Terbarukan: 28% dari total konsumsi"].map((item) => (
                  <div key={item} className="laporan-item"><div className="dot"></div><div>{item}</div></div>
                ))}
              </div>
              <div className="laporan-col">
                <h4>Sosial :</h4>
                {["Karyawan Lokal: 85%", "UMKM Wanita Terdaftar"].map((item) => (
                  <div key={item} className="laporan-item"><div className="dot"></div><div>{item}</div></div>
                ))}
              </div>
              <div className="laporan-col">
                <h4>Ekonomi :</h4>
                {["Peningkatan pendapatan setelah kredit: +19%", "Peningkatan skor kredit: +4 poin"].map((item) => (
                  <div key={item} className="laporan-item"><div className="dot"></div><div>{item}</div></div>
                ))}
              </div>
            </div>
            <div className="laporan-actions">
              <button className="btn btn-outline">Cetak Laporan PDF</button>
              <button className="btn btn-primary" onClick={goNext}>Lanjut Kredit Hijau →</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-card">
            <div className="kredit-header"><h2>Pengajuan Kredit Hijau</h2></div>
            <div className="kredit-body">
              <div className="kredit-section">
                <h4>Ajukan Kredit Hijau :</h4>
                {[
                  { label: "Plafon Kredit Direkomendasikan", val: "Rp 25.000.000" },
                  { label: "Tenor", val: "12–24 Bulan" },
                  { label: "Tingkat Bunga Khusus", val: "7,5% (lebih rendah)" },
                  { label: "Syarat", val: "Skor ESG minimal 70" },
                ].map((r) => (
                  <div key={r.label} className="kredit-row">
                    <div className="k-dot"></div>
                    <div><strong>{r.label}</strong> : {r.val}</div>
                  </div>
                ))}
              </div>
              <div className="kredit-section">
                <h4>Persyaratan Pengajuan :</h4>
                {["KTP", "Surat Izin Usaha", "Rekening Koran 3 Bulan"].map((doc) => (
                  <div key={doc} className="doc-row">
                    <span>{doc}</span>
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7l5 5v11H6z" /></svg>
                  </div>
                ))}
              </div>
            </div>
            <div className="kredit-submit">
              <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>Kirim Pengajuan</button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Pengajuan Berhasil!"
        buttonText="Kembali ke Beranda"
        onButtonClick={() => { setShowModal(false); navigate("dashboard"); }}
      />
    </div>
  );
}