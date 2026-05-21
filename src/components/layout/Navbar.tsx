import type { PageName } from "../../App";

const LogoIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 4h2v-2h2v2h2v2h-2v2h-2v-2h-2z" />
  </svg>
);

interface NavbarProps {
  navigate: (page: PageName) => void;
  variant?: "landing" | "auth" | "logged";
}

export default function Navbar({ navigate, variant = "auth" }: NavbarProps) {
  if (variant === "landing") {
    return (
      <nav>
        <a className="logo" onClick={() => navigate("home")} style={{ cursor: "pointer" }}>
          <div className="logo-icon"><LogoIcon /></div>
          F-Tech Solution
        </a>
        <ul className="nav-links">
          <li><a href="#what">Solusi</a></li>
          <li><a href="#features">Fitur</a></li>
          <li><a href="#faq-anchor">FAQ</a></li>
        </ul>
        <div className="nav-right">
          <button className="btn btn-outline" onClick={() => navigate("login")}>Login</button>
          <button className="btn btn-primary" onClick={() => navigate("register")}>Daftar</button>
        </div>
      </nav>
    );
  }

  if (variant === "logged") {
    return (
      <nav>
        <a className="logo" onClick={() => navigate("dashboard")} style={{ cursor: "pointer" }}>
          <div className="logo-icon"><LogoIcon /></div>
          F-Tech Solution
        </a>
        <ul className="nav-links">
          <li><a href="#">Solusi</a></li>
          <li><a href="#">FAQ</a></li>
          <li><a href="#">Laporan</a></li>
        </ul>
        <div className="nav-right">
          <div className="user-chip">
            <div className="user-avatar">A</div>
            Arva
          </div>
        </div>
      </nav>
    );
  }

  // default: auth
  return (
    <nav>
      <a className="logo" onClick={() => navigate("home")} style={{ cursor: "pointer" }}>
        <div className="logo-icon"><LogoIcon /></div>
        Fin Sustain
      </a>
      <ul className="nav-links">
        <li><a href="#">Solusi</a></li>
        <li><a href="#">FAQ</a></li>
        <li><a href="#">Laporan</a></li>
      </ul>
    </nav>
  );
}