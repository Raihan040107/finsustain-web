import { useState, useEffect, useCallback } from "react";

import type { PageName } from "../App";

interface IndexProps {
  navigate: (page: PageName) => void;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  order: number;
}

interface StudiKasusItem {
  id: number;
  nomor: string;
  nama_usaha: string;
  deskripsi: string;
  pencapaian: string[];
  order: number;
}

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export default function Index({ navigate }: IndexProps) {
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeNav, setActiveNav] = useState<string>("beranda");
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [studiKasus, setStudiKasus] = useState<StudiKasusItem[]>([]);

  // ── Scroll reveal helper ─────────────────────────────────────────────────

  const attachRevealObserver = useCallback(() => {
    const elements = Array.from(document.querySelectorAll("[data-reveal]")) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.remove("opacity-0", "translate-y-10");
            el.classList.add("opacity-100", "translate-y-0");
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── Scroll reveal — elemen statis ────────────────────────────────────────

  useEffect(() => {
    return attachRevealObserver();
  }, [attachRevealObserver]);

  // ── Scroll reveal — re-run saat studiKasus data masuk ───────────────────

  useEffect(() => {
    if (studiKasus.length === 0) return;
    return attachRevealObserver();
  }, [studiKasus, attachRevealObserver]);

  // ── Fetch FAQ & Studi Kasus ──────────────────────────────────────────────

  useEffect(() => {
    // Fetch FAQ
    fetch(`${API_BASE}/faqs`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((json) => setFaqs(json.data ?? []))
      .catch(() => {
        setFaqs([
          {
            id: 1,
            question: "Apa saja syarat untuk mengajukan pendanaan hijau di F-Tech?",
            answer:
              "Anda hanya perlu menyiapkan dokumen legalitas usaha dasar, laporan operasional atau keuangan sederhana, dan mengisi kuesioner indikator hijau yang telah kami sediakan di platform.",
            order: 1,
          },
          {
            id: 2,
            question: "Berapa lama proses evaluasi skor ESG usaha saya?",
            answer: "Proses evaluasi dilakukan secara instan! Algoritma AI kami akan langsung mengalkulasi skor komitmen hijau Anda sesaat setelah Anda menyelesaikan form pertanyaan.",
            order: 2,
          },
          {
            id: 3,
            question: "Apakah data laporan keuangan dan operasional saya aman?",
            answer: "Sangat aman. Semua data yang Anda unggah dienkripsi dengan standar keamanan industri tingkat tinggi dan tidak akan disebarluaskan tanpa persetujuan eksplisit dari Anda.",
            order: 3,
          },
          {
            id: 4,
            question: "Bagaimana cara F-Tech menghubungkan bisnis saya dengan investor?",
            answer:
              "Setelah skor ESG Anda diterbitkan, profil bisnis hijau Anda akan otomatis masuk ke dalam direktori portofolio eksklusif yang diakses oleh puluhan bank dan lembaga pendanaan internasional mitra kami.",
            order: 4,
          },
        ]);
      });

    // Fetch Studi Kasus
    fetch(`${API_BASE}/studi-kasus`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((json) => setStudiKasus(json.data ?? []))
      .catch(() => {
        setStudiKasus([
          {
            id: 1,
            nomor: "01",
            nama_usaha: "Koperasi Tani Agro Lestari",
            deskripsi: "Mengajukan modal solar panel irigasi mandiri dengan melampirkan berkas sertifikasi organik bebas pestisida kimia berbahaya.",
            pencapaian: ["Pendanaan Cair Rp850 Juta", "Hemat Biaya Listrik Operasional 35%"],
            order: 1,
          },
          {
            id: 2,
            nomor: "02",
            nama_usaha: "PT Eco Plastik Manufaktur",
            deskripsi: "Melakukan pembuktian siklus daur ulang kemasan limbah polimer tinggi lewat sistem transparansi audit rantai pasok F-Tech.",
            pencapaian: ["Kredit Sindikasi Rp4.2 Miliar", "240 Ton Sampah Berhasil Didaur Ulang"],
            order: 2,
          },
        ]);
      });
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="page-home" className="block min-h-screen bg-[#2d2d2d] text-[#f0ece8] font-body antialiased overflow-y-auto pt-[76px]">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#2d2d2d]/95 backdrop-blur-[14px] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-[76px] px-6 md:px-12 w-full">
          <div className="flex items-center gap-3 font-head text-[1.2rem] font-bold text-[#f0ece8] cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-[40px] h-[40px] bg-[#e05c2a] rounded-xl flex items-center justify-center font-extrabold text-[1.15rem] text-white shrink-0 shadow-md">
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-current text-white">
                <path d="M12 2L2 22h20L12 2zm0 4.3L18.8 19H5.2L12 6.3z" />
              </svg>
            </div>
            <span className="tracking-wide">
              F-Tech <span className="text-[#e05c2a]">Solution</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <span
              className={`font-semibold text-[0.95rem] cursor-pointer relative transition-colors ${
                activeNav === "beranda" ? "text-[#e05c2a] after:absolute after:bottom-[-26px] after:left-0 after:w-full after:h-[2px] after:bg-[#e05c2a]" : "text-[#b0a89e] hover:text-[#f0ece8]"
              }`}
              onClick={() => {
                setActiveNav("beranda");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Beranda
            </span>
            <span
              className={`font-semibold text-[0.95rem] cursor-pointer relative transition-colors ${
                activeNav === "fitur" ? "text-[#e05c2a] after:absolute after:bottom-[-26px] after:left-0 after:w-full after:h-[2px] after:bg-[#e05c2a]" : "text-[#b0a89e] hover:text-[#f0ece8]"
              }`}
              onClick={() => {
                setActiveNav("fitur");
                scrollToSection("langkah-pengajuan");
              }}
            >
              Fitur
            </span>
            <span
              className={`font-semibold text-[0.95rem] cursor-pointer relative transition-colors ${
                activeNav === "faq" ? "text-[#e05c2a] after:absolute after:bottom-[-26px] after:left-0 after:w-full after:h-[2px] after:bg-[#e05c2a]" : "text-[#b0a89e] hover:text-[#f0ece8]"
              }`}
              onClick={() => {
                setActiveNav("faq");
                scrollToSection("faq-section");
              }}
            >
              FAQ
            </span>
          </div>

          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("login")}
                  className="inline-flex items-center justify-center font-semibold text-[0.9rem] px-6 py-2.5 rounded-full border-[1.5px] border-[#b0a89e] text-[#f0ece8] hover:border-[#f0ece8] hover:bg-white/[0.05] transition-all cursor-pointer"
                >
                  Masuk
                </button>
                <button
                  onClick={() => navigate("register")}
                  className="inline-flex items-center justify-center font-bold text-[0.9rem] px-6 py-2.5 rounded-full bg-[#e05c2a] text-white hover:bg-[#f06b35] hover:shadow-[0_6px_20px_rgba(224,92,42,0.35)] hover:-translate-y-[1px] transition-all cursor-pointer"
                >
                  Daftar Akun
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 bg-white/[0.10] border border-white/[0.12] rounded-full p-[6px] pr-3.5 text-[0.88rem] font-medium">
                <div className="w-[30px] h-[30px] rounded-full bg-[#e05c2a] flex items-center justify-center text-[0.8rem] font-bold text-white">U</div>
                <span>User Account</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="w-full bg-[radial-gradient(ellipse_90%_100%_at_65%_40%,#4a3e38_0%,#2d2d2d_65%)] pt-12 pb-24 md:pt-16 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div data-reveal className="w-full lg:max-w-[550px] space-y-6 text-left opacity-0 translate-y-10 transition-all duration-1000 ease-out">
            <h1 className="font-head text-4xl md:text-[3.4rem] font-extrabold text-white leading-[1.2] tracking-tight">
              Solusi Finansial untuk <br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-[#e05c2a] to-[#f06b35] bg-clip-text text-transparent">Usaha Berkelanjutan</span>
            </h1>
            <p className="text-[1rem] md:text-[1.05rem] text-[#b0a89e] leading-[1.75] font-normal max-w-lg">
              F-Tech Solution mempercepat pertumbuhan bisnis Anda melalui integrasi modal hijau, analisis cerdas, dan monitoring keberlanjutan lingkungan.
            </p>

            <div className="pt-2 space-y-3.5">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate("login")}
                    className="inline-flex items-center justify-center font-bold text-[0.95rem] px-8 py-3.5 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] hover:shadow-[0_8px_24px_rgba(224,92,42,0.3)] hover:-translate-y-[1px] transition-all cursor-pointer"
                  >
                    Mulai Sekarang
                  </button>
                  <p className="text-[0.88rem] text-[#b0a89e] pl-1">
                    Sudah punya akun?{" "}
                    <span onClick={() => navigate("login")} className="text-[#e05c2a] font-semibold cursor-pointer hover:underline underline-offset-2 transition-all">
                      Masuk di sini
                    </span>
                  </p>
                </>
              ) : (
                <button
                  onClick={() => navigate("dashboard")}
                  className="inline-flex items-center justify-center font-bold text-[0.95rem] px-8 py-3.5 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] hover:shadow-[0_8px_24px_rgba(224,92,42,0.3)] hover:-translate-y-[1px] transition-all cursor-pointer"
                >
                  Masuk ke Dashboard
                </button>
              )}
            </div>
          </div>

          {/* MOCKUP KANAN */}
          <div data-reveal className="w-full lg:max-w-[520px] flex justify-center lg:justify-end items-center opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-150">
            <div className="w-full max-w-[480px]">
              <div className="bg-[#1a1a1a] rounded-[16px] border-2 border-[#444] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
                <div className="bg-[#252525] h-8 flex items-center px-4 gap-2 border-b border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="p-5 grid grid-cols-[110px_1fr] gap-4 min-h-[240px]">
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex flex-col gap-2">
                    <div className="p-2 rounded bg-[#e05c2a] text-[0.65rem] text-white font-bold text-center">Dashboard</div>
                    <div className="p-2 text-[0.65rem] text-[#b0a89e] font-medium">Metrik Emisi</div>
                    <div className="p-2 text-[0.65rem] text-[#b0a89e] font-medium">Laporan ESG</div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="text-[0.8rem] font-bold text-white tracking-wide">Ringkasan Karbon & Finansial</div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white/[0.05] border border-white/5 rounded-lg p-2.5 text-center">
                        <div className="text-[0.6rem] text-[#b0a89e] mb-1">Skor ESG</div>
                        <div className="text-[1rem] font-black text-[#4caf50]">A+</div>
                      </div>
                      <div className="bg-white/[0.05] border border-white/5 rounded-lg p-2.5 text-center">
                        <div className="text-[0.6rem] text-[#b0a89e] mb-1">Emisi</div>
                        <div className="text-[1rem] font-black text-white">-12%</div>
                      </div>
                      <div className="bg-white/[0.05] border border-white/5 rounded-lg p-2.5 text-center">
                        <div className="text-[0.6rem] text-[#b0a89e] mb-1">Dana</div>
                        <div className="text-[1rem] font-black text-[#e05c2a]">Rp2.5B</div>
                      </div>
                    </div>
                    <div className="bg-white/[0.05] border border-white/5 rounded-lg p-3 h-[75px] relative overflow-hidden">
                      <div className="text-[0.6rem] text-[#b0a89e] font-medium">Efisiensi Energi Bulanan</div>
                      <div className="absolute bottom-2 left-3 right-3 flex items-end gap-1.5 h-[40px]">
                        <div className="flex-1 bg-[#e05c2a] rounded-sm opacity-60 h-[40%] transition-all" />
                        <div className="flex-1 bg-[#e05c2a] rounded-sm opacity-60 h-[55%] transition-all" />
                        <div className="flex-1 bg-[#e05c2a] rounded-sm opacity-70 h-[75%] transition-all" />
                        <div className="flex-1 bg-[#e05c2a] rounded-sm opacity-60 h-[62%] transition-all" />
                        <div className="flex-1 bg-[#e05c2a] rounded-sm opacity-90 h-[95%] transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-20 h-5 bg-[#333] mx-auto rounded-b shadow-inner" />
              <div className="w-[140px] h-2 bg-[#2a2a2a] mx-auto rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="w-full bg-white/[0.03] border-t border-b border-white/[0.08] py-10 md:py-12">
        <div data-reveal className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
          <div className="text-center space-y-1">
            <div className="font-head text-3xl md:text-[2.5rem] font-black text-[#e05c2a] leading-normal tracking-tight">Rp 12.8T+</div>
            <div className="text-[0.82rem] md:text-[0.88rem] text-[#b0a89e] font-medium uppercase tracking-wider">Dana Tersalurkan Global</div>
          </div>
          <div className="text-center space-y-1">
            <div className="font-head text-3xl md:text-[2.5rem] font-black text-[#e05c2a] leading-normal tracking-tight">4,500+</div>
            <div className="text-[0.82rem] md:text-[0.88rem] text-[#b0a89e] font-medium uppercase tracking-wider">UMKM Hijau Terverifikasi</div>
          </div>
          <div className="text-center space-y-1">
            <div className="font-head text-3xl md:text-[2.5rem] font-black text-[#e05c2a] leading-normal tracking-tight">1.2M Ton</div>
            <div className="text-[0.82rem] md:text-[0.88rem] text-[#b0a89e] font-medium uppercase tracking-wider">Reduksi Emisi CO₂ Bersama</div>
          </div>
          <div className="text-center space-y-1">
            <div className="font-head text-3xl md:text-[2.5rem] font-black text-[#e05c2a] leading-normal tracking-tight">98.4%</div>
            <div className="text-[0.82rem] md:text-[0.88rem] text-[#b0a89e] font-medium uppercase tracking-wider">Tingkat Keberhasilan Proyek</div>
          </div>
        </div>
      </section>

      {/* ESG SECTION */}
      <section data-reveal className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="bg-white/[0.03] border border-white/10 rounded-[24px] p-8 md:p-10 relative overflow-hidden shadow-lg">
            <div className="absolute -top-16 -right-16 w-[220px] h-[220px] bg-[radial-gradient(circle,rgba(224,92,42,0.15)_0%,transparent_70%)] rounded-full" />
            <div className="flex flex-wrap justify-center items-center gap-8 py-6 relative z-10">
              <div className="w-[100px] h-[100px] rounded-full flex flex-col items-center justify-center font-head font-extrabold relative border-t-4 border-[#4caf50] bg-[#4caf50]/[0.06] shadow-md">
                <span className="text-[1.6rem] text-[#4caf50] leading-none">E</span>
                <span className="text-[0.6rem] text-[#b0a89e] font-body font-normal uppercase tracking-wider mt-1">Env</span>
                <span className="text-[0.85rem] font-bold text-white mt-0.5">88%</span>
              </div>
              <div className="w-[100px] h-[100px] rounded-full flex flex-col items-center justify-center font-head font-extrabold relative border-t-4 border-[#2196f3] bg-[#2196f3]/[0.06] shadow-md">
                <span className="text-[1.6rem] text-[#2196f3] leading-none">S</span>
                <span className="text-[0.6rem] text-[#b0a89e] font-body font-normal uppercase tracking-wider mt-1">Soc</span>
                <span className="text-[0.85rem] font-bold text-white mt-0.5">76%</span>
              </div>
              <div className="w-[100px] h-[100px] rounded-full flex flex-col items-center justify-center font-head font-extrabold relative border-t-4 border-[#e05c2a] bg-[#e05c2a]/[0.06] shadow-md">
                <span className="text-[1.6rem] text-[#e05c2a] leading-none">G</span>
                <span className="text-[0.6rem] text-[#b0a89e] font-body font-normal uppercase tracking-wider mt-1">Gov</span>
                <span className="text-[0.85rem] font-bold text-white mt-0.5">92%</span>
              </div>
            </div>
            <p className="text-center text-[0.85rem] text-[#b0a89e] font-medium tracking-wide mt-4">Skor rata-rata performa pilar ESG UMKM terdaftar</p>
          </div>

          <div className="space-y-4">
            <div className="text-[0.8rem] font-bold tracking-[0.15em] text-[#e05c2a] uppercase">Apa Itu Fin Sustain?</div>
            <h2 className="font-head text-3xl md:text-[2.2rem] font-extrabold text-white leading-[1.25]">Sistem Penilaian Finansial & Standar Dampak Hijau</h2>
            <p className="text-[0.98rem] text-[#b0a89e] leading-[1.75]">
              Kami menggabungkan data laporan keuangan konvensional dengan matriks audit kelayakan karbon modern untuk menciptakan gerbang investasi berisiko rendah yang transparan bagi penyedia dana
              internasional.
            </p>
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#e05c2a]/10 border border-[#e05c2a]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#e05c2a] font-bold text-base">✓</span>
                </div>
                <div>
                  <h4 className="text-[0.95rem] font-bold text-white mb-0.5">Skor Kredibilitas Instan</h4>
                  <p className="text-[0.85rem] text-[#b0a89e] leading-[1.6]">Pemrosesan matriks ESG instan pasca input data untuk melihat posisi kelayakan kredit emisi usaha Anda.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-[#e05c2a]/10 border border-[#e05c2a]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#e05c2a] font-bold text-base">✓</span>
                </div>
                <div>
                  <h4 className="text-[0.95rem] font-bold text-white mb-0.5">Kesesuaian Regulasi Global</h4>
                  <p className="text-[0.85rem] text-[#b0a89e] leading-[1.6]">Kerangka verifikasi terstandarisasi penuh dengan prinsip taksonomi hijau Eropa, OJK, dan IFC.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US SECTION */}
      <section className="w-full bg-white/[0.01] border-t border-white/[0.06] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div data-reveal className="text-center max-w-2xl mx-auto mb-16 space-y-3 opacity-0 translate-y-10 transition-all duration-1000 ease-out">
            <div className="text-[0.8rem] font-bold tracking-[0.15em] text-[#e05c2a] uppercase">Keunggulan</div>
            <h2 className="font-head text-3xl md:text-[2.2rem] font-extrabold text-white leading-tight">Mengapa Menggunakan F-Tech Platform?</h2>
            <p className="text-[0.95rem] text-[#b0a89e] leading-[1.7]">
              Kami menyederhanakan proses audit yang awalnya berbulan-bulan menjadi hitungan menit demi ekosistem transaksi finansial yang efektif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              data-reveal
              className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-8 hover:border-[#e05c2a]/40 hover:-translate-y-1 transition-all duration-300 shadow-sm opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-100"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e05c2a]/10 border border-[#e05c2a]/20 flex items-center justify-center text-[#e05c2a] mb-5 font-bold text-lg">01</div>
              <h3 className="font-head text-[1.1rem] font-bold text-white mb-2">Suku Bunga Preferensial</h3>
              <p className="text-[0.88rem] text-[#b0a89e] leading-[1.65]">
                Dapatkan keringanan nilai suku bunga pinjaman modal yang jauh lebih rendah bagi bisnis dengan skor komitmen pelestarian hijau yang tinggi.
              </p>
            </div>
            <div
              data-reveal
              className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-8 hover:border-[#e05c2a]/40 hover:-translate-y-1 transition-all duration-300 shadow-sm opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-200"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e05c2a]/10 border border-[#e05c2a]/20 flex items-center justify-center text-[#e05c2a] mb-5 font-bold text-lg">02</div>
              <h3 className="font-head text-[1.1rem] font-bold text-white mb-2">Pelaporan Otomatis</h3>
              <p className="text-[0.88rem] text-[#b0a89e] leading-[1.65]">
                Sistem kami akan mengekstrak data dari dokumen laporan operasional harian Anda menjadi berkas siap pakai untuk dikirimkan langsung ke investor.
              </p>
            </div>
            <div
              data-reveal
              className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] p-8 hover:border-[#e05c2a]/40 hover:-translate-y-1 transition-all duration-300 shadow-sm opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#e05c2a]/10 border border-[#e05c2a]/20 flex items-center justify-center text-[#e05c2a] mb-5 font-bold text-lg">03</div>
              <h3 className="font-head text-[1.1rem] font-bold text-white mb-2">Ekosistem Investor Luas</h3>
              <p className="text-[0.88rem] text-[#b0a89e] leading-[1.65]">
                Tembus akses pendanaan lintas negara ke puluhan lembaga perbankan korporasi dan institusi Ventura yang mencari portfolio berdampak iklim positif.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS SECTION */}
      <section id="langkah-pengajuan" className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 scroll-mt-24">
        <div className="text-center mb-20 space-y-3">
          <div className="text-[0.8rem] font-bold tracking-[0.15em] text-[#e05c2a] uppercase">Langkah Pengajuan</div>
          <h2 className="font-head text-3xl md:text-[2.2rem] font-extrabold text-white">Bagaimana Cara Kerjanya?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 relative">
          <div className="hidden lg:block absolute top-[40px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#e05c2a] to-[#e05c2a]/20 z-0" />

          <div data-reveal className="text-center px-4 relative z-10 space-y-4 opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-100">
            <div className="w-[80px] h-[80px] rounded-full bg-[#e05c2a] text-white flex items-center justify-center font-head text-[1.5rem] font-black shadow-[0_8px_24px_rgba(224,92,42,0.35)] mx-auto">
              1
            </div>
            <h4 className="font-head text-[1rem] font-bold text-white">Unggah Profil</h4>
            <p className="text-[0.85rem] text-[#b0a89e] leading-[1.6]">Daftarkan legalitas usaha serta masukkan dokumen keuangan operasional dasar.</p>
          </div>
          <div data-reveal className="text-center px-4 relative z-10 space-y-4 opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-200">
            <div className="w-[80px] h-[80px] rounded-full bg-white/[0.06] border-2 border-white/[0.15] text-[#b0a89e] flex items-center justify-center font-head text-[1.5rem] font-black mx-auto">
              2
            </div>
            <h4 className="font-head text-[1rem] font-bold text-white">Evaluasi ESG</h4>
            <p className="text-[0.85rem] text-[#b0a89e] leading-[1.6]">Isi kuesioner indikator hijau terpadu mengenai konsumsi energi & tata kelola sosial bisnis.</p>
          </div>
          <div data-reveal className="text-center px-4 relative z-10 space-y-4 opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-300">
            <div className="w-[80px] h-[80px] rounded-full bg-white/[0.06] border-2 border-white/[0.15] text-[#b0a89e] flex items-center justify-center font-head text-[1.5rem] font-black mx-auto">
              3
            </div>
            <h4 className="font-head text-[1rem] font-bold text-white">Terbitkan Skor</h4>
            <p className="text-[0.85rem] text-[#b0a89e] leading-[1.6]">Algoritma AI cerdas memproses nilai peringkat kelayakan investasi berkelanjutan Anda.</p>
          </div>
          <div data-reveal className="text-center px-4 relative z-10 space-y-4 opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-400">
            <div className="w-[80px] h-[80px] rounded-full bg-white/[0.06] border-2 border-white/[0.15] text-[#b0a89e] flex items-center justify-center font-head text-[1.5rem] font-black mx-auto">
              4
            </div>
            <h4 className="font-head text-[1rem] font-bold text-white">Pencairan Dana</h4>
            <p className="text-[0.85rem] text-[#b0a89e] leading-[1.6]">Hubungkan profil hijau Anda dengan kontrak penawaran investasi dari ekosistem modal bank.</p>
          </div>
        </div>
      </section>

      {/* ── CASE STUDY SECTION — DINAMIS ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="text-center mb-16 space-y-3">
          <div className="text-[0.8rem] font-bold tracking-[0.15em] text-[#e05c2a] uppercase">Studi Kasus</div>
          <h2 className="font-head text-3xl md:text-[2.2rem] font-extrabold text-white">UMKM yang Sukses Bertransisi Hijau</h2>
        </div>

        {studiKasus.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] h-[200px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {studiKasus.map((item, index) => (
              <div
                key={item.id}
                data-reveal
                className="bg-white/[0.03] border border-white/[0.08] rounded-[20px] overflow-hidden shadow-sm opacity-0 translate-y-10 transition-all duration-1000 ease-out"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-[#e05c2a]/10 border-b border-[#e05c2a]/15 p-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e05c2a] flex items-center justify-center font-head font-black text-[0.9rem] text-white">{item.nomor}</div>
                  <h3 className="font-head text-[1rem] font-bold text-white">{item.nama_usaha}</h3>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-[0.88rem] text-[#b0a89e] leading-[1.7]">{item.deskripsi}</p>
                  <div className="flex flex-col gap-2 pt-2">
                    {item.pencapaian.map((p, i) => (
                      <span key={i} className="inline-flex items-center gap-2 bg-[#4caf50]/10 border border-[#4caf50]/20 rounded-full px-4 py-1.5 text-[0.8rem] font-semibold text-[#81c784] w-fit">
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SDGs SECTION */}
      <section className="w-full bg-white/[0.01] border-t border-white/[0.06] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 space-y-3">
            <div className="text-[0.8rem] font-bold tracking-[0.15em] text-[#e05c2a] uppercase">Dampak Global</div>
            <h2 className="font-head text-3xl md:text-[2.2rem] font-extrabold text-white">Mendukung Penuh Target PBB (SDGs)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              data-reveal
              className="bg-[#4caf50]/[0.05] border border-white/[0.08] rounded-[20px] p-8 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#4caf50] shadow-sm opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-100"
            >
              <div className="font-head text-[2.8rem] font-black opacity-[0.08] absolute right-6 top-4 leading-none text-white">07</div>
              <span className="inline-block bg-[#4caf50]/15 text-[#81c784] px-3 py-1 rounded-full text-[0.7rem] font-bold tracking-widest mb-4 uppercase">SDG 7</span>
              <h3 className="font-head text-[1.1rem] font-bold text-white mb-2">Energi Bersih & Terjangkau</h3>
              <p className="text-[0.88rem] text-[#b0a89e] leading-[1.65]">Meningkatkan adopsi peralihan pembangkit listrik tenaga surya dan biomassa alternatif di sektor usaha daerah terpencil.</p>
            </div>
            <div
              data-reveal
              className="bg-[#ff9800]/[0.05] border border-white/[0.08] rounded-[20px] p-8 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#ff9800] shadow-sm opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-200"
            >
              <div className="font-head text-[2.8rem] font-black opacity-[0.08] absolute right-6 top-4 leading-none text-white">12</div>
              <span className="inline-block bg-[#ff9800]/15 text-[#ffb74d] px-3 py-1 rounded-full text-[0.7rem] font-bold tracking-widest mb-4 uppercase">SDG 12</span>
              <h3 className="font-head text-[1.1rem] font-bold text-white mb-2">Konsumsi & Produksi Bertanggung Jawab</h3>
              <p className="text-[0.88rem] text-[#b0a89e] leading-[1.65]">Menekan pemborosan sisa bahan baku manufaktur lewat skema manajemen rantai sirkular ekonomi sisa produksi.</p>
            </div>
            <div
              data-reveal
              className="bg-[#2196f3]/[0.05] border border-white/[0.08] rounded-[20px] p-8 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[#2196f3] shadow-sm opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-300"
            >
              <div className="font-head text-[2.8rem] font-black opacity-[0.08] absolute right-6 top-4 leading-none text-white">13</div>
              <span className="inline-block bg-[#2196f3]/15 text-[#64b5f6] px-3 py-1 rounded-full text-[0.7rem] font-bold tracking-widest mb-4 uppercase">SDG 13</span>
              <h3 className="font-head text-[1.1rem] font-bold text-white mb-2">Penanganan Perubahan Iklim</h3>
              <p className="text-[0.88rem] text-[#b0a89e] leading-[1.65]">
                Membantu entitas komersial mencatatkan jejak hitungan jejak karbon harian guna mewujudkan aksi emisi Nol Bersih (Net Zero).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq-section" className="w-full bg-white/[0.02] border-t border-white/[0.06] py-24 md:py-32 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <div className="text-[0.8rem] font-bold tracking-[0.15em] text-[#e05c2a] uppercase">Pertanyaan Umum</div>
            <h2 className="font-head text-3xl md:text-[2.2rem] font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-[0.95rem] text-[#b0a89e]">Punya pertanyaan seputar platform? Temukan jawabannya di bawah ini.</p>
          </div>

          {faqs.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-[16px] h-[72px] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={faq.id} className="bg-white/[0.03] border border-white/[0.08] rounded-[16px] overflow-hidden transition-all duration-300">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left font-semibold text-[1.05rem] text-white hover:bg-white/[0.02] transition-colors gap-4"
                    >
                      <span>{faq.question}</span>
                      <span className={`text-[#e05c2a] text-xl font-bold transform transition-transform duration-300 shrink-0 ${isOpen ? "rotate-45" : "rotate-0"}`}>＋</span>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[200px] border-t border-white/[0.05]" : "max-h-0"}`}>
                      <div className="p-6 text-[0.95rem] text-[#b0a89e] leading-[1.65]">{faq.answer}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
