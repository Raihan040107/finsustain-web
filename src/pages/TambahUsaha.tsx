import { useState } from "react";
import type { PageName } from "../App";
import Navbar from "../components/layout/Navbar";
import Modal from "../components/ui/Modal";

const FileSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7l5 5v11H6z" />
  </svg>
);

export default function TambahUsaha({ navigate }: { navigate: (page: PageName) => void }) {
  const [showWaiting, setShowWaiting] = useState(false);
  const [showVerified, setShowVerified] = useState(false);

  return (
    <div className="page-upload">
      <Navbar navigate={navigate} variant="auth" />
      <div className="upload-center">
        <div className="upload-card glass-card">
          <div className="upload-left">
            <div className="upload-icon">
              <svg viewBox="0 0 24 24"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 4h2v-2h2v2h2v2h-2v2h-2v-2h-2z" /></svg>
            </div>
            <h3>Upload Document</h3>
            <p>Upload your document here.</p>
          </div>
          <div className="upload-right">
            {["KTP", "NPWP", "Surat Izin Usaha"].map((doc) => (
              <label key={doc} className="file-input-row">
                <FileSVG />
                <span>{doc}</span>
                <input type="file" />
              </label>
            ))}
            <div className="upload-submit">
              <button className="btn btn-primary" onClick={() => setShowWaiting(true)}>Submit</button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showWaiting}
        onClose={() => setShowWaiting(false)}
        title="Menunggu Verifikasi!"
        description="Data Anda sedang diproses. Silakan tunggu verifikasi dari Admin."
        buttonText="OK"
        onButtonClick={() => { setShowWaiting(false); setShowVerified(true); }}
      />
      <Modal
        isOpen={showVerified}
        onClose={() => setShowVerified(false)}
        title="Verifikasi Sukses!"
        buttonText="Tutup"
        onButtonClick={() => { setShowVerified(false); navigate("login"); }}
      />
    </div>
  );
}