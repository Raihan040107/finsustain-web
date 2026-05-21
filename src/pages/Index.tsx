import Navbar from "../components/layout/Navbar";
import Header from "../components/layout/Header";
import HeroSection from "../components/sections/HeroSection";
import type { PageName } from "../App";

interface IndexProps {
  navigate: (page: PageName) => void;
}

export default function Index({ navigate }: IndexProps) {
  return (
    // Pembungkus utama: Menggunakan warna background gelap (#2d2d2d) dan font DM Sans / Syne sesuai template asli
    <div className="min-h-screen bg-[#2d2d2d] text-[#f0ece8] font-sans antialiased selection:bg-[#e05c2a] selection:text-white">
      
      {/* 1. Navbar Utama */}
      <Navbar navigate={navigate} />
      
      {/* 2. Header / Banner Section */}
      <Header />
      
      {/* 3. Konten Utama (HeroSection & Konten Tambahan Berdasarkan HTML Template) */}
      <main className="container mx-auto px-4 py-12 max-w-7xl space-y-16">
        
        {/* Bagian Hero dari tim lu */}
        <HeroSection navigate={navigate} />

        {/* Tambahan Struktur Fitur Utama dari Fin Sustain HTML (Ditulis Full React/Tailwind) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          
          {/* Card 1: Fin Sustain Card Style */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-[#e05c2a]/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-[#e05c2a]/10 flex items-center justify-center text-[#e05c2a] mb-4 group-hover:bg-[#e05c2a] group-hover:text-white transition-all duration-300">
              <i className="ti ti-leaf text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold font-mono text-white mb-2">Sustainable Finance</h3>
            <p className="text-[#b0a89e] text-sm leading-relaxed">
              Solusi pendanaan ramah lingkungan untuk mendukung keberlanjutan bisnis dan masa depan hijau Anda.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-[#e05c2a]/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-[#e05c2a]/10 flex items-center justify-center text-[#e05c2a] mb-4 group-hover:bg-[#e05c2a] group-hover:text-white transition-all duration-300">
              <i className="ti ti-chart-bar text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold font-mono text-white mb-2">Analisis Finansial</h3>
            <p className="text-[#b0a89e] text-sm leading-relaxed">
              Pantau dan analisis perkembangan usaha Anda dengan matriks keuangan terintegrasi dan akurat.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-[#e05c2a]/50 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-[#e05c2a]/10 flex items-center justify-center text-[#e05c2a] mb-4 group-hover:bg-[#e05c2a] group-hover:text-white transition-all duration-300">
              <i className="ti ti-shield-check text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold font-mono text-white mb-2">Terpercaya & Aman</h3>
            <p className="text-[#b0a89e] text-sm leading-relaxed">
              Sistem perlindungan data tingkat tinggi untuk menjamin keamanan informasi bisnis dan privasi Anda.
            </p>
          </div>

        </section>

        {/* Section Action / Ajakan Berdasarkan Template */}
        <section className="bg-gradient-to-r from-[#e05c2a] to-[#f06b35] rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-[#e05c2a]/10">
          <h2 className="text-2xl md:text-4xl font-black mb-4 text-white font-mono tracking-tight">
            Siap Mengembangkan Usaha Anda?
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8 text-base md:text-lg">
            Ajukan pendanaan atau konsultasi sekarang juga dan mari bangun bisnis yang berkelanjutan bersama F-Tech Solution.
          </p>
          <button 
            onClick={() => navigate("step1")}
            className="bg-[#2d2d2d] text-white hover:bg-black font-semibold px-8 py-3.5 rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Mulai Ajukan Sekarang
          </button>
        </section>

      </main>

      {/* Footer Ringkas */}
      <footer className="border-t border-white/5 mt-20 py-6 text-center text-xs text-[#b0a89e]">
        <p>&copy; {new Date().getFullYear()} F-Tech Solution – Fin Sustain. All rights reserved.</p>
      </footer>

    </div>
  );
}