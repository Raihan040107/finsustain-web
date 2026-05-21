import type { PageName } from "../../App";

export const MockScreen = ({ variant = "home" }: { variant?: "home" | "logged" }) => (
  <div className="mock-screen">
    <div className="monitor-body">
      <div className="monitor-bar">
        <div className="monitor-dot red"></div>
        <div className="monitor-dot yellow"></div>
        <div className="monitor-dot green"></div>
      </div>
      <div className="mock-dashboard">
        <div className="mock-sidebar">
          <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginBottom: "4px", fontWeight: 700 }}>
            {variant === "logged" ? "F-Tech" : "Fin-Sustain"}
          </div>
          <div className="mock-sidebar-item active">Analisa ESG</div>
          <div className="mock-sidebar-item">Analysis</div>
          <div className="mock-sidebar-item">Score & Reports</div>
        </div>
        <div className="mock-main">
          <div className="mock-title">ESG Dashboard</div>
          <div className="mock-cards">
            <div className="mock-card">
              <div>{variant === "logged" ? "Skor ESG Klien" : "Skor ESG"}</div>
              <div className="mock-card-val">{variant === "logged" ? "30" : "65"}</div>
              <div>/100</div>
            </div>
            <div className="mock-card">
              <div>Emisi Karbon</div>
              <div className="mock-card-val" style={{ color: "#4caf50" }}>{variant === "logged" ? "100%" : "−12%"}</div>
            </div>
            <div className="mock-card">
              <div>{variant === "logged" ? "Kepatuhan" : "Kredit Hijau"}</div>
              <div className="mock-card-val" style={{ color: "var(--accent)" }}>{variant === "logged" ? "78%" : "7,5%"}</div>
            </div>
          </div>
          <div className="mock-charts">
            <div className="mock-chart">
              <div style={{ fontSize: "0.55rem", marginBottom: "4px" }}>{variant === "logged" ? "Kepatuhan Karyawan" : "Lingkungan"}</div>
              <div className="mock-chart-bars">
                {[40, 65, 50, 80, 60].map((h, i) => <div key={i} className="bar" style={{ height: `${h}%` }}></div>)}
              </div>
            </div>
            <div className="mock-chart">
              <div style={{ fontSize: "0.55rem", marginBottom: "4px" }}>{variant === "logged" ? "Tata Kelola" : "Tata Kelola"}</div>
              <div className="mock-chart-bars">
                {[70, 45, 90, 55, 75].map((h, i) => <div key={i} className="bar" style={{ height: `${h}%` }}></div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="monitor-stand"></div>
    <div className="monitor-foot"></div>
  </div>
);

export default function HeroSection({ navigate }: { navigate: (page: PageName) => void }) {
  return (
    <section className="lp-hero">
      <div className="lp-hero-inner">
        <div className="hero-left">
          <div className="hero-tag">
            <svg viewBox="0 0 24 24" style={{ width: "14px", height: "14px", fill: "currentColor" }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            Platform ESG & Green Finance untuk UMKM
          </div>
          <h1>Evaluasi &amp; <span>Manajemen Dampak</span> ESG Bisnis Anda</h1>
          <p>Fin-Sustain UMKM hadir untuk membantu pelaku usaha kecil dan menengah mengukur keberlanjutan bisnis, mendapatkan rekomendasi otomatis, dan mengakses kredit hijau dengan bunga lebih rendah.</p>
          <div className="hero-btns">
            <button className="btn btn-primary btn-lg" onClick={() => navigate("register")}>Mulai Gratis →</button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate("login")}>Sudah Punya Akun</button>
          </div>
        </div>
        <div className="hero-right">
          <MockScreen variant="home" />
        </div>
      </div>
    </section>
  );
}