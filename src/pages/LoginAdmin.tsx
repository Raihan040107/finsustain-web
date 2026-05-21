import { useState } from "react";
import type { FormEvent } from "react";
import { isAxiosError } from "axios";
import api from "../lib/api";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);

      const response = await api.post("/login", {
        email,
        password,
      });

      // Admin-only: reject if not admin role
      if (response.data.user.id_role !== 2) {
        setError("Akses ditolak. Halaman ini khusus untuk administrator.");
        // Revoke the token immediately since this is the admin portal
        await api.post(
          "/logout",
          {},
          {
            headers: { Authorization: `Bearer ${response.data.token}` },
          },
        );
        return;
      }

      localStorage.setItem("token", response.data.token);
      window.location.assign("/admin/dashboard");
    } catch (err) {
      if (isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message ?? "Login gagal");
        return;
      }
      setError("Login gagal");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="admin-login-root">
      {/* Animated background grid */}
      <div className="grid-bg" aria-hidden="true" />

      {/* Floating orbs */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* Scanline overlay */}
      <div className="scanlines" aria-hidden="true" />

      <div className="layout">
        {/* Left panel — branding */}
        <div className="brand-panel">
          <div className="brand-inner">
            <div className="logo-wrap">
              <span className="logo-letter">F</span>
            </div>

            <div className="brand-text">
              <p className="brand-sup">F-Tech Solution</p>
              <h1 className="brand-title">
                Admin
                <br />
                <span className="brand-accent">Command</span>
                <br />
                Center
              </h1>
              <p className="brand-desc">Portal administrasi eksklusif untuk pengelolaan Platform Evaluasi &amp; Manajemen ESG</p>
            </div>

            <div className="stat-row">
              {[
                { label: "Kredit Hijau", value: "ESG" },
                { label: "Dampak", value: "REAL" },
                { label: "Akses", value: "ADMIN" },
              ].map((s) => (
                <div className="stat-item" key={s.label}>
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative corner lines */}
          <div className="corner-tl" aria-hidden="true" />
          <div className="corner-br" aria-hidden="true" />
        </div>

        {/* Right panel — form */}
        <div className="form-panel">
          <div className="form-card">
            {/* Card top stripe */}
            <div className="card-stripe" aria-hidden="true" />

            <div className="form-header">
              <div className="shield-icon" aria-label="Admin shield icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <p className="form-eyebrow">Portal Administrator</p>
                <h2 className="form-title">Masuk ke Sistem</h2>
              </div>
            </div>

            <div className="divider" aria-hidden="true">
              <span />
              <p>Identifikasi Admin</p>
              <span />
            </div>

            {error && (
              <div className="error-box" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="the-form">
              {/* Email field */}
              <div className={`field-group ${focusedField === "email" ? "focused" : ""} ${email ? "has-value" : ""}`}>
                <label htmlFor="admin-email">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Email Administrator
                </label>
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@ftech.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="username"
                  required
                />
                <div className="field-border" aria-hidden="true" />
              </div>

              {/* Password field */}
              <div className={`field-group ${focusedField === "password" ? "focused" : ""} ${password ? "has-value" : ""}`}>
                <label htmlFor="admin-password">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="current-password"
                  required
                />
                <div className="field-border" aria-hidden="true" />
              </div>

              <button type="submit" className={`submit-btn ${isSubmitting ? "loading" : ""}`} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10 17 15 12 10 7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Masuk sebagai Admin
                  </>
                )}
              </button>
            </form>

            <p className="back-link">
              Bukan admin?{" "}
              <a href="/login">
                Login sebagai pengguna
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            </p>

            {/* Security badge */}
            <div className="security-badge" aria-label="Secure connection indicator">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Koneksi aman · Terenkripsi SSL
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* ─── Reset & Root ─────────────────────────────────────── */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .admin-login-root {
          --dark:    #1e2125;
          --darker:  #16181c;
          --darkest: #0f1013;
          --medium:  #2a2e35;
          --orange:  #e8581a;
          --orange2: #ff7a3d;
          --amber:   #f5a623;
          --text:    #f0ede8;
          --muted:   #8b8f99;
          --border:  rgba(255,255,255,0.08);
          --glass:   rgba(255,255,255,0.04);

          position: relative;
          min-height: 100vh;
          background: var(--darkest);
          color: var(--text);
          font-family: 'Segoe UI', system-ui, sans-serif;
          overflow: hidden;
        }

        /* ─── Animated Grid Background ────────────────────────── */
        .grid-bg {
          position: fixed; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(232,88,26,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,88,26,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: grid-drift 20s linear infinite;
        }
        @keyframes grid-drift {
          from { background-position: 0 0; }
          to   { background-position: 48px 48px; }
        }

        /* ─── Orbs ─────────────────────────────────────────────── */
        .orb {
          position: fixed; border-radius: 50%; filter: blur(80px);
          pointer-events: none; z-index: 0;
          animation: orb-float 8s ease-in-out infinite alternate;
        }
        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(232,88,26,0.18), transparent 70%);
          top: -150px; left: -100px;
          animation-duration: 9s;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(245,166,35,0.12), transparent 70%);
          bottom: -100px; right: 200px;
          animation-duration: 11s; animation-delay: -3s;
        }
        .orb-3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(255,122,61,0.10), transparent 70%);
          top: 40%; left: 40%;
          animation-duration: 13s; animation-delay: -6s;
        }
        @keyframes orb-float {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.08); }
        }

        /* ─── Scanlines ────────────────────────────────────────── */
        .scanlines {
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
        }

        /* ─── Layout ───────────────────────────────────────────── */
        .layout {
          position: relative; z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
        }
        @media (max-width: 900px) {
          .layout { grid-template-columns: 1fr; }
          .brand-panel { display: none; }
        }

        /* ─── Brand Panel ──────────────────────────────────────── */
        .brand-panel {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          padding: 60px 48px;
          background: linear-gradient(135deg, var(--darker) 0%, var(--darkest) 100%);
          border-right: 1px solid var(--border);
          overflow: hidden;
        }
        .brand-inner {
          display: flex; flex-direction: column; gap: 40px;
          max-width: 380px;
          animation: slide-in-left 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .logo-wrap {
          width: 64px; height: 64px; border-radius: 16px;
          background: linear-gradient(135deg, var(--orange), var(--orange2));
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 40px rgba(232,88,26,0.4), 0 8px 24px rgba(0,0,0,0.4);
          animation: logo-pulse 3s ease-in-out infinite;
        }
        @keyframes logo-pulse {
          0%, 100% { box-shadow: 0 0 40px rgba(232,88,26,0.4), 0 8px 24px rgba(0,0,0,0.4); }
          50%       { box-shadow: 0 0 60px rgba(232,88,26,0.6), 0 8px 32px rgba(0,0,0,0.5); }
        }
        .logo-letter {
          font-size: 28px; font-weight: 900; color: #fff;
          letter-spacing: -1px;
        }

        .brand-sup {
          font-size: 11px; font-weight: 700; letter-spacing: 3px;
          text-transform: uppercase; color: var(--orange2);
          margin-bottom: 12px;
        }
        .brand-title {
          font-size: clamp(38px, 4vw, 52px);
          font-weight: 900; line-height: 1.0;
          letter-spacing: -2px;
          color: var(--text);
        }
        .brand-accent {
          background: linear-gradient(90deg, var(--orange), var(--amber));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .brand-desc {
          margin-top: 16px;
          font-size: 14px; line-height: 1.6; color: var(--muted);
          max-width: 300px;
        }

        .stat-row {
          display: flex; gap: 24px;
          padding: 20px 0;
          border-top: 1px solid var(--border);
        }
        .stat-item { display: flex; flex-direction: column; gap: 4px; }
        .stat-value {
          font-size: 12px; font-weight: 800; letter-spacing: 2px;
          color: var(--orange2);
        }
        .stat-label {
          font-size: 11px; color: var(--muted); letter-spacing: 0.5px;
        }

        /* Corner decorations */
        .corner-tl, .corner-br {
          position: absolute; width: 60px; height: 60px;
          pointer-events: none;
        }
        .corner-tl {
          top: 24px; left: 24px;
          border-top: 2px solid rgba(232,88,26,0.4);
          border-left: 2px solid rgba(232,88,26,0.4);
          border-radius: 4px 0 0 0;
        }
        .corner-br {
          bottom: 24px; right: 24px;
          border-bottom: 2px solid rgba(232,88,26,0.4);
          border-right: 2px solid rgba(232,88,26,0.4);
          border-radius: 0 0 4px 0;
        }

        /* ─── Form Panel ───────────────────────────────────────── */
        .form-panel {
          display: flex; align-items: center; justify-content: center;
          padding: 48px 40px;
          background: var(--darkest);
        }

        .form-card {
          position: relative;
          width: 100%; max-width: 420px;
          background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 36px 32px 28px;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset;
          animation: card-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Top stripe accent */
        .card-stripe {
          position: absolute; top: 0; left: 32px; right: 32px; height: 2px;
          background: linear-gradient(90deg, transparent, var(--orange), var(--amber), transparent);
          border-radius: 0 0 2px 2px;
        }

        /* ─── Form Header ──────────────────────────────────────── */
        .form-header {
          display: flex; align-items: flex-start; gap: 16px;
          margin-bottom: 24px;
        }
        .shield-icon {
          flex-shrink: 0;
          width: 48px; height: 48px; border-radius: 12px;
          background: linear-gradient(135deg, rgba(232,88,26,0.2), rgba(245,166,35,0.1));
          border: 1px solid rgba(232,88,26,0.3);
          display: flex; align-items: center; justify-content: center;
          color: var(--orange2);
        }
        .form-eyebrow {
          font-size: 11px; font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase; color: var(--orange2);
          margin-bottom: 4px;
        }
        .form-title {
          font-size: 22px; font-weight: 800; letter-spacing: -0.5px;
          color: var(--text);
        }

        /* ─── Divider ──────────────────────────────────────────── */
        .divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px;
        }
        .divider span {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
        }
        .divider p {
          font-size: 10px; font-weight: 600; letter-spacing: 2px;
          text-transform: uppercase; color: var(--muted);
          white-space: nowrap;
        }

        /* ─── Error Box ────────────────────────────────────────── */
        .error-box {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 14px; border-radius: 10px;
          background: rgba(220, 38, 38, 0.12);
          border: 1px solid rgba(220, 38, 38, 0.3);
          color: #fca5a5; font-size: 13px; line-height: 1.4;
          margin-bottom: 16px;
          animation: shake 0.4s cubic-bezier(0.36,0.07,0.19,0.97);
        }
        .error-box svg { flex-shrink: 0; margin-top: 1px; }
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(3px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }

        /* ─── Form ─────────────────────────────────────────────── */
        .the-form { display: flex; flex-direction: column; gap: 18px; }

        .field-group {
          display: flex; flex-direction: column; gap: 8px;
          position: relative;
        }
        .field-group label {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
          color: var(--muted);
          transition: color 0.2s;
        }
        .field-group.focused label { color: var(--orange2); }

        .field-group input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 14px; color: var(--text);
          outline: none;
          transition: all 0.25s;
          caret-color: var(--orange2);
        }
        .field-group input::placeholder { color: rgba(255,255,255,0.2); }
        .field-group.focused input {
          background: rgba(255,255,255,0.07);
          border-color: var(--orange);
          box-shadow: 0 0 0 3px rgba(232,88,26,0.12);
        }

        /* Animated bottom border */
        .field-border {
          position: absolute; bottom: 0; left: 8px; right: 8px; height: 2px;
          background: linear-gradient(90deg, var(--orange), var(--amber));
          border-radius: 2px;
          transform: scaleX(0); transform-origin: center;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        .field-group.focused .field-border { transform: scaleX(1); }

        /* ─── Submit Button ────────────────────────────────────── */
        .submit-btn {
          margin-top: 6px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 15px 24px;
          border-radius: 12px; border: none; cursor: pointer;
          font-size: 14px; font-weight: 700; letter-spacing: 0.5px;
          color: #fff;
          background: linear-gradient(135deg, var(--orange) 0%, var(--orange2) 60%, var(--amber) 100%);
          background-size: 200% 200%;
          box-shadow: 0 6px 24px rgba(232,88,26,0.4), 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.25s;
          position: relative; overflow: hidden;
        }
        .submit-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0; transition: opacity 0.25s;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(232,88,26,0.5), 0 4px 12px rgba(0,0,0,0.4);
        }
        .submit-btn:hover::before { opacity: 1; }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .submit-btn.loading { background-position: 100% 100%; }

        /* Spinner */
        .spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ─── Back Link ────────────────────────────────────────── */
        .back-link {
          margin-top: 16px;
          text-align: center; font-size: 12px; color: var(--muted);
        }
        .back-link a {
          color: var(--orange2); text-decoration: none; font-weight: 600;
          display: inline-flex; align-items: center; gap: 3px;
          transition: color 0.2s;
        }
        .back-link a:hover { color: var(--amber); }

        /* ─── Security Badge ───────────────────────────────────── */
        .security-badge {
          margin-top: 20px; padding-top: 16px;
          border-top: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center; gap: 6px;
          font-size: 10px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase; color: rgba(255,255,255,0.25);
        }
      `}</style>
    </main>
  );
}

export default AdminLogin;
