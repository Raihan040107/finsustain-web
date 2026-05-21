import type { PageName } from "../App";
import Navbar from "../components/layout/Navbar";

export default function Register({ navigate }: { navigate: (page: PageName) => void }) {
  return (
    <div className="page-auth">
      <Navbar navigate={navigate} variant="auth" />
      <div className="auth-bg">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg viewBox="0 0 24 24"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 4h2v-2h2v2h2v2h-2v2h-2v-2h-2z" /></svg>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: "1rem", fontWeight: 700 }}>Welcome to Fin Sustain</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Registration to manage your sustainability</div>
            </div>
          </div>
          <h3>Registration</h3>
          <div className="input-group">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>
            <input type="text" placeholder="Username" />
          </div>
          <div className="input-group">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.8-2.2-5-5-5S7 3.2 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1v2z" /></svg>
            <input type="password" placeholder="Password" />
          </div>
          <div className="auth-row">
            <label><input type="checkbox" /> Ingat saya</label>
            <a href="#">Lupa Password?</a>
          </div>
          <button className="btn btn-primary btn-full" onClick={() => navigate("upload")}>Daftar</button>
          <p style={{ marginTop: "16px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Sudah punya akun?{" "}
            <a href="#" style={{ color: "var(--accent)" }} onClick={(e) => { e.preventDefault(); navigate("login"); }}>Login di sini</a>
          </p>
        </div>
      </div>
    </div>
  );
}