import { useState, useEffect } from "react";
import type { AdminUsaha } from "../../types";
import api from "../../lib/api";

type VerifikasiUsahaPageProps = {
  usaha: AdminUsaha[];
  onUpdated: () => Promise<void>;
};

type DocPreview = {
  label: string;
  path: string;
};

type ConfirmDialog = {
  title: string;
  subtitle: string;
  desc: string;
  meta: string;
  metaIcon: string;
  variant: "approve" | "reject" | "danger" | "info";
  icon: string;
  confirmLabel: string;
  onConfirm: () => void;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

const STATUS_LABEL: Record<string, string> = {
  menunggu: "Menunggu",
  terverifikasi: "Terverifikasi",
  ditolak: "Ditolak",
};

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status: string) {
  if (status === "terverifikasi") return "role-badge status-approved";
  if (status === "ditolak") return "role-badge status-rejected";
  return "role-badge status-pending";
}

function isPdf(path: string) {
  return path.toLowerCase().endsWith(".pdf");
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────

const VARIANT_ICON_STYLE: Record<string, { background: string; color: string }> = {
  approve: { background: "rgba(34,197,94,0.12)", color: "#16a34a" },
  reject: { background: "rgba(234,179,8,0.12)", color: "#a16207" },
  danger: { background: "rgba(239,68,68,0.12)", color: "#dc2626" },
  info: { background: "rgba(59,130,246,0.12)", color: "#2563eb" },
};

const VARIANT_BTN_CLASS: Record<string, string> = {
  approve: "btn-small btn-approve",
  reject: "btn-small btn-reject",
  danger: "btn-small btn-danger",
  info: "btn-small btn-approve",
};

function ConfirmModal({ dialog, loading, onClose }: { dialog: ConfirmDialog; loading: boolean; onClose: () => void }) {
  const iconStyle = VARIANT_ICON_STYLE[dialog.variant];
  const btnClass = VARIANT_BTN_CLASS[dialog.variant];

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1100,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card, #1e1e1e)",
          border: "1px solid var(--border, #333)",
          borderRadius: 16,
          width: "100%",
          maxWidth: 420,
          overflow: "hidden",
          animation: "confirmIn .18s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem 1.2rem",
            borderBottom: "1px solid var(--border, #2a2a2a)",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              background: iconStyle.background,
              color: iconStyle.color,
            }}
          >
            <i className={`ti ${dialog.icon}`} aria-hidden="true" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: "0.92rem", lineHeight: 1.3, color: "var(--accent, #e05c2a)" }}>{dialog.title}</p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted, #888)", marginTop: "0.2rem" }}>{dialog.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid var(--border, #333)",
              borderRadius: 8,
              padding: "0.2rem 0.45rem",
              cursor: "pointer",
              color: "var(--text-muted, #888)",
              lineHeight: 1,
            }}
          >
            <i className="ti ti-x" style={{ fontSize: "0.95rem" }} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1rem 1.2rem" }}>
          <p style={{ fontSize: "0.84rem", color: "var(--text-secondary, #aaa)", lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: dialog.desc }} />
          {dialog.meta && (
            <div
              style={{
                marginTop: "0.8rem",
                padding: "0.55rem 0.75rem",
                background: "var(--bg-base, #161616)",
                border: "1px solid var(--border, #2a2a2a)",
                borderRadius: 8,
                fontSize: "0.79rem",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                color: "var(--text-muted, #888)",
              }}
            >
              <i className={`ti ${dialog.metaIcon}`} style={{ fontSize: "0.95rem", flexShrink: 0 }} aria-hidden="true" />
              <span dangerouslySetInnerHTML={{ __html: dialog.meta }} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "0.75rem 1.2rem",
            borderTop: "1px solid var(--border, #2a2a2a)",
            background: "var(--bg-base, #161616)",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
          }}
        >
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              background: "none",
              border: "1px solid var(--border, #333)",
              borderRadius: 8,
              padding: "0.38rem 0.85rem",
              cursor: "pointer",
              fontSize: "0.8rem",
              color: "var(--text-secondary, #aaa)",
            }}
          >
            Batal
          </button>
          <button className={btnClass} disabled={loading} onClick={dialog.onConfirm} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
            {loading ? (
              <>
                <i className="ti ti-loader-2 ti-spin" style={{ fontSize: "0.85rem" }} /> Memproses...
              </>
            ) : (
              <>
                <i className={`ti ${dialog.icon}`} style={{ fontSize: "0.85rem" }} /> {dialog.confirmLabel}
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confirmIn {
          from { opacity:0; transform:scale(.96) translateY(6px); }
          to   { opacity:1; transform:scale(1)   translateY(0);   }
        }
      `}</style>
    </div>
  );
}

// ── Doc Preview Modal ─────────────────────────────────────────────────────────

function DocPreviewModal({ doc, onClose }: { doc: DocPreview; onClose: () => void }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const pdf = isPdf(doc.path);

  useEffect(() => {
    let objectUrl: string;
    const token = localStorage.getItem("token");

    setLoading(true);
    setError(false);
    setBlobUrl(null);

    fetch(`${API_BASE}/admin/dokumen?path=${encodeURIComponent(doc.path)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Gagal mengambil file");
        return r.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [doc.path]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card, #1e1e1e)",
          border: "1px solid var(--border, #333)",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "860px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.9rem 1.2rem",
            borderBottom: "1px solid var(--border, #333)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <i className={`ti ti-${pdf ? "file-type-pdf" : "photo"}`} style={{ fontSize: "1.1rem", color: "var(--accent, #e05c2a)" }} />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{doc.label}</span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {blobUrl && (
              <a href={blobUrl} download={doc.label} className="btn-small" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", textDecoration: "none" }}>
                <i className="ti ti-download" style={{ fontSize: "0.8rem" }} />
                Unduh
              </a>
            )}
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "1px solid var(--border, #444)",
                borderRadius: "8px",
                padding: "0.28rem 0.6rem",
                cursor: "pointer",
                color: "var(--text-primary, #fff)",
                lineHeight: 1,
              }}
            >
              <i className="ti ti-x" style={{ fontSize: "1rem", color: "var(--text-primary, #fff)" }} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "300px",
          }}
        >
          {loading && (
            <div style={{ textAlign: "center", opacity: 0.5 }}>
              <i className="ti ti-loader-2 ti-spin" style={{ fontSize: "2rem" }} />
              <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>Memuat dokumen...</p>
            </div>
          )}
          {error && (
            <div style={{ textAlign: "center", opacity: 0.5 }}>
              <i className="ti ti-file-off" style={{ fontSize: "2rem" }} />
              <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>Gagal memuat dokumen.</p>
            </div>
          )}
          {blobUrl &&
            !loading &&
            !error &&
            (pdf ? (
              <iframe src={blobUrl} title={doc.label} style={{ width: "100%", height: "68vh", border: "none", borderRadius: "8px" }} />
            ) : (
              <img src={blobUrl} alt={doc.label} style={{ maxWidth: "100%", maxHeight: "68vh", objectFit: "contain", borderRadius: "8px" }} />
            ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function VerifikasiUsahaPage({ usaha, onUpdated }: VerifikasiUsahaPageProps) {
  const [savingId, setSavingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [preview, setPreview] = useState<DocPreview | null>(null);
  const [dialog, setDialog] = useState<ConfirmDialog | null>(null);

  function openPreview(label: string, path: string) {
    setPreview({ label, path });
  }

  // ── Aksi + builder dialog ──────────────────────────────────────────────────

  async function updateStatus(idUsaha: number, status: "terverifikasi" | "ditolak" | "menunggu") {
    setDialog(null);
    try {
      setSavingId(idUsaha);
      setMessage(null);
      await api.put(`/admin/usaha/${idUsaha}/verifikasi`, { status_verifikasi: status });
      await onUpdated();
      setMessage({ text: "Status verifikasi usaha berhasil diperbarui.", ok: true });
    } catch {
      setMessage({ text: "Gagal memperbarui status verifikasi.", ok: false });
    } finally {
      setSavingId(null);
    }
  }

  async function deleteUsaha(idUsaha: number) {
    setDialog(null);
    try {
      setSavingId(idUsaha);
      setMessage(null);
      await api.delete(`/admin/usaha/${idUsaha}`);
      await onUpdated();
      setMessage({ text: "Usaha berhasil dihapus.", ok: true });
    } catch {
      setMessage({ text: "Gagal menghapus usaha.", ok: false });
    } finally {
      setSavingId(null);
    }
  }

  function confirmVerifikasi(item: AdminUsaha) {
    setDialog({
      title: "Verifikasi usaha",
      subtitle: "Status akan diubah menjadi Terverifikasi",
      desc: `Usaha <strong>${item.nama_usaha}</strong> akan ditandai sebagai terverifikasi dan pemiliknya mendapatkan akses penuh ke platform.`,
      meta: `<strong>${item.nama_user}</strong> &mdash; ${item.email_user}`,
      metaIcon: "ti-user",
      variant: "approve",
      icon: "ti-circle-check",
      confirmLabel: "Ya, verifikasi",
      onConfirm: () => updateStatus(item.id_usaha, "terverifikasi"),
    });
  }

  function confirmTolak(item: AdminUsaha) {
    setDialog({
      title: "Tolak pengajuan",
      subtitle: "Status akan diubah menjadi Ditolak",
      desc: `Usaha <strong>${item.nama_usaha}</strong> akan ditandai sebagai ditolak. Pemilik dapat mengajukan ulang setelah memperbaiki dokumen.`,
      meta: `<strong>${item.nama_user}</strong> &mdash; ${item.email_user}`,
      metaIcon: "ti-user",
      variant: "reject",
      icon: "ti-ban",
      confirmLabel: "Ya, tolak",
      onConfirm: () => updateStatus(item.id_usaha, "ditolak"),
    });
  }

  function confirmUbahTerkonfirmasi(item: AdminUsaha) {
    setDialog({
      title: "Ubah ke Terkonfirmasi",
      subtitle: "Status ditolak akan dikembalikan ke Terverifikasi",
      desc: `Status usaha <strong>${item.nama_usaha}</strong> akan diubah kembali menjadi terverifikasi. Pastikan dokumen sudah dicek ulang.`,
      meta: `Saat ini: Ditolak &nbsp;&rarr;&nbsp; akan menjadi: <strong>Terverifikasi</strong>`,
      metaIcon: "ti-refresh",
      variant: "info",
      icon: "ti-circle-check",
      confirmLabel: "Ya, ubah ke terverifikasi",
      onConfirm: () => updateStatus(item.id_usaha, "terverifikasi"),
    });
  }

  function confirmUbahDitolak(item: AdminUsaha) {
    setDialog({
      title: "Ubah ke Ditolak",
      subtitle: "Status terverifikasi akan diubah ke Ditolak",
      desc: `Status usaha <strong>${item.nama_usaha}</strong> akan diubah menjadi ditolak. Akses fitur terverifikasi milik pemilik akan dicabut.`,
      meta: `Saat ini: Terverifikasi &nbsp;&rarr;&nbsp; akan menjadi: <strong>Ditolak</strong>`,
      metaIcon: "ti-refresh",
      variant: "reject",
      icon: "ti-ban",
      confirmLabel: "Ya, ubah ke ditolak",
      onConfirm: () => updateStatus(item.id_usaha, "ditolak"),
    });
  }

  function confirmHapus(item: AdminUsaha) {
    setDialog({
      title: "Hapus usaha",
      subtitle: "Tindakan ini tidak dapat dibatalkan",
      desc: `Seluruh data usaha <strong>${item.nama_usaha}</strong>, termasuk dokumen dan riwayat verifikasi, akan dihapus secara permanen.`,
      meta: `Data tidak dapat dipulihkan setelah dihapus.`,
      metaIcon: "ti-alert-triangle",
      variant: "danger",
      icon: "ti-trash",
      confirmLabel: "Ya, hapus permanen",
      onConfirm: () => deleteUsaha(item.id_usaha),
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="page-content page-wide">
      {preview && <DocPreviewModal doc={preview} onClose={() => setPreview(null)} />}

      {dialog && (
        <ConfirmModal
          dialog={dialog}
          loading={savingId !== null}
          onClose={() => {
            if (savingId === null) setDialog(null);
          }}
        />
      )}

      {message && (
        <div className={`alert ${message.ok ? "alert-success" : "alert-error"}`}>
          <i className={`ti ti-${message.ok ? "check" : "alert-circle"}`} aria-hidden="true" />
          {message.text}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Verifikasi usaha</h3>
          <span className="badge">{usaha.length} pengajuan</span>
        </div>

        {usaha.length === 0 ? (
          <div className="empty-state">
            <i className="ti ti-building-off" aria-hidden="true" />
            <p>Belum ada usaha yang perlu diverifikasi.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Usaha</th>
                  <th>Pemilik</th>
                  <th>Dokumen</th>
                  <th>Status</th>
                  <th>Skor</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {usaha.map((item) => (
                  <tr key={item.id_usaha}>
                    <td>
                      <div className="user-cell stacked-cell">
                        <strong>{item.nama_usaha}</strong>
                        <span className="text-muted">{item.bidang_usaha}</span>
                        <span className="text-muted">{formatDate(item.tanggal_registrasi)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="stacked-cell">
                        <strong>{item.nama_user}</strong>
                        <span className="text-muted">{item.email_user}</span>
                      </div>
                    </td>
                    <td>
                      <div className="doc-list">
                        {item.ktp ? (
                          <button className="doc-preview-btn" onClick={() => openPreview(`KTP — ${item.nama_usaha}`, item.ktp as string)}>
                            <i className="ti ti-id" />
                            KTP
                            <span className="doc-eye">
                              <i className="ti ti-eye" />
                            </span>
                          </button>
                        ) : (
                          <span className="text-muted">KTP: -</span>
                        )}

                        {item.npwp ? (
                          <button className="doc-preview-btn" onClick={() => openPreview(`NPWP — ${item.nama_usaha}`, item.npwp as string)}>
                            <i className="ti ti-file-invoice" />
                            NPWP
                            <span className="doc-eye">
                              <i className="ti ti-eye" />
                            </span>
                          </button>
                        ) : (
                          <span className="text-muted">NPWP: -</span>
                        )}

                        {item.surat_izin_usaha ? (
                          <button className="doc-preview-btn" onClick={() => openPreview(`NIB/SIUP — ${item.nama_usaha}`, item.surat_izin_usaha as string)}>
                            <i className="ti ti-file-certificate" />
                            NIB/SIUP
                            <span className="doc-eye">
                              <i className="ti ti-eye" />
                            </span>
                          </button>
                        ) : (
                          <span className="text-muted">NIB/SIUP: -</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={statusClass(item.status_verifikasi)}>{STATUS_LABEL[item.status_verifikasi] ?? item.status_verifikasi}</span>
                      <div className="text-muted mt-1">{formatDate(item.tanggal_verifikasi)}</div>
                    </td>
                    <td className="text-muted">{item.skor_total ? `${Math.round(Number(item.skor_total))} - ${item.kategori_skor ?? "-"}` : "-"}</td>
                    <td>
                      <div className="action-btns left">
                        {/* ── Menunggu: Verifikasi + Tolak ── */}
                        {item.status_verifikasi === "menunggu" && (
                          <>
                            <button className="btn-small btn-approve" disabled={savingId === item.id_usaha} onClick={() => confirmVerifikasi(item)}>
                              Verifikasi
                            </button>
                            <button className="btn-small btn-reject" disabled={savingId === item.id_usaha} onClick={() => confirmTolak(item)}>
                              Tolak
                            </button>
                          </>
                        )}

                        {/* ── Terverifikasi: Diterima (disabled) + Ubah Ditolak + Hapus ── */}
                        {item.status_verifikasi === "terverifikasi" && (
                          <>
                            <button className="btn-small btn-approve" disabled style={{ opacity: 0.45, cursor: "not-allowed" }}>
                              <i className="ti ti-circle-check" style={{ fontSize: "0.8rem" }} />
                              Diterima
                            </button>
                            <button className="btn-small btn-reject" disabled={savingId === item.id_usaha} onClick={() => confirmUbahDitolak(item)}>
                              Ubah Ditolak
                            </button>
                            <button className="btn-small btn-danger" disabled={savingId === item.id_usaha} onClick={() => confirmHapus(item)}>
                              <i className="ti ti-trash" style={{ fontSize: "0.8rem" }} />
                              Hapus
                            </button>
                          </>
                        )}

                        {/* ── Ditolak: Ditolak (disabled) + Ubah Terkonfirmasi + Hapus ── */}
                        {item.status_verifikasi === "ditolak" && (
                          <>
                            <button className="btn-small btn-reject" disabled style={{ opacity: 0.45, cursor: "not-allowed" }}>
                              <i className="ti ti-ban" style={{ fontSize: "0.8rem" }} />
                              Ditolak
                            </button>
                            <button className="btn-small btn-approve" disabled={savingId === item.id_usaha} onClick={() => confirmUbahTerkonfirmasi(item)}>
                              Ubah Terkonfirmasi
                            </button>
                            <button className="btn-small btn-danger" disabled={savingId === item.id_usaha} onClick={() => confirmHapus(item)}>
                              <i className="ti ti-trash" style={{ fontSize: "0.8rem" }} />
                              Hapus
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
