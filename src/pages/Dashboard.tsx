import type { PageName } from "../App";
import Navbar from "../components/layout/Navbar";
import { MockScreen } from "../components/sections/HeroSection";

export default function Dashboard({ navigate }: { navigate: (page: PageName) => void }) {
  return (
    <div className="page-dashboard">
      <Navbar navigate={navigate} variant="logged" />
      <div className="home-hero">
        <div className="hero-left">
          <h1>Platform Terpadu Evaluasi & Manajemen Dampak ESG</h1>
          <p>Optimalkan Kredit Hijau dan Dampak Bisnis anda.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate("step1")}>
            Mulai Evaluasi
          </button>
        </div>
        <div className="hero-right">
          <MockScreen variant="logged" />
        </div>
      </div>
    </div>
  );
}