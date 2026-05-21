import { useState, type FormEvent } from "react";
import api from "../../lib/api";
import type { Pertanyaan } from "../../types";

type PertanyaanPageProps = {
  pertanyaan: Pertanyaan[];
  onRefresh: () => Promise<void>;
};

export default function PertanyaanPage({ pertanyaan, onRefresh }: PertanyaanPageProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk modal edit
  const [editItem, setEditItem] = useState<Pertanyaan | null>(null);
  const [editInput, setEditInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // State untuk konfirmasi hapus
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Tambah ──────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      setError("");
      setSuccess("");
      setIsSubmitting(true);
      await api.post("/admin/pertanyaan", { pertanyaan: input });
      setInput("");
      setSuccess("Pertanyaan berhasil ditambahkan.");
      await onRefresh();
    } catch {
      setError("Gagal menambah pertanyaan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Edit ─────────────────────────────────────────────────
  function openEdit(item: Pertanyaan) {
    setEditItem(item);
    setEditInput(item.pertanyaan);
  }

  function closeEdit() {
    setEditItem(null);
    setEditInput("");
  }

  async function handleEdit(e: FormEvent) {
    e.preventDefault();
    if (!editItem || !editInput.trim()) return;

    try {
      setError("");
      setSuccess("");
      setIsEditing(true);
      await api.put(`/admin/pertanyaan/${editItem.pertanyaan_id}`, {
        pertanyaan: editInput,
      });
      setSuccess("Pertanyaan berhasil diperbarui.");
      closeEdit();
      await onRefresh();
    } catch {
      setError("Gagal memperbarui pertanyaan.");
    } finally {
      setIsEditing(false);
    }
  }

  // ── Hapus ─────────────────────────────────────────────────
  async function handleDelete() {
    if (deleteId === null) return;

    try {
      setError("");
      setSuccess("");
      setIsDeleting(true);
      await api.delete(`/admin/pertanyaan/${deleteId}`);
      setSuccess("Pertanyaan berhasil dihapus.");
      setDeleteId(null);
      await onRefresh();
    } catch {
      setError("Gagal menghapus pertanyaan.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="page-content">
      {/* ── Alert ── */}
      {error && (
        <div className="alert alert-error">
          <i className="ti ti-alert-circle" aria-hidden="true" />
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <i className="ti ti-circle-check" aria-hidden="true" />
          {success}
        </div>
      )}

      {/* ── Form Tambah ── */}
      <div className="card">
        <h3 className="card-title">Tambah pertanyaan</h3>
        <form className="input-row" onSubmit={handleSubmit}>
          <input className="text-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tulis pertanyaan baru..." disabled={isSubmitting} />
          <button className="btn-primary" type="submit" disabled={isSubmitting || !input.trim()}>
            {isSubmitting ? (
              <>
                <i className="ti ti-loader-2 spin" aria-hidden="true" /> Menyimpan...
              </>
            ) : (
              <>
                <i className="ti ti-plus" aria-hidden="true" /> Tambah
              </>
            )}
          </button>
        </form>
      </div>

      {/* ── Tabel Pertanyaan ── */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Daftar pertanyaan</h3>
          <span className="badge">{pertanyaan.length} item</span>
        </div>

        {pertanyaan.length === 0 ? (
          <div className="empty-state">
            <i className="ti ti-message-off" aria-hidden="true" />
            <p>Belum ada pertanyaan.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th style={{ width: "48px" }}>#</th>
                  <th>Pertanyaan</th>
                  <th style={{ width: "120px", textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pertanyaan.map((item, index) => (
                  <tr key={item.pertanyaan_id}>
                    <td>
                      <span className="q-num">{index + 1}</span>
                    </td>
                    <td style={{ lineHeight: "1.55" }}>{item.pertanyaan}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon btn-edit" onClick={() => openEdit(item)} title="Edit">
                          <i className="ti ti-edit" aria-hidden="true" />
                        </button>
                        <button className="btn-icon btn-delete" onClick={() => setDeleteId(item.pertanyaan_id)} title="Hapus">
                          <i className="ti ti-trash" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal Edit ── */}
      {editItem && (
        <div className="modal-backdrop" onClick={closeEdit}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit pertanyaan</h3>
              <button className="btn-icon" onClick={closeEdit}>
                <i className="ti ti-x" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={handleEdit}>
              <textarea
                className="text-input"
                style={{ width: "100%", minHeight: "100px", resize: "vertical" }}
                value={editInput}
                onChange={(e) => setEditInput(e.target.value)}
                disabled={isEditing}
              />
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeEdit}>
                  Batal
                </button>
                <button type="submit" className="btn-primary" disabled={isEditing || !editInput.trim()}>
                  {isEditing ? (
                    <>
                      <i className="ti ti-loader-2 spin" aria-hidden="true" /> Menyimpan...
                    </>
                  ) : (
                    "Simpan perubahan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Konfirmasi Hapus ── */}
      {deleteId !== null && (
        <div className="modal-backdrop" onClick={() => setDeleteId(null)}>
          <div className="modal-box modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-danger">
              <i className="ti ti-trash" aria-hidden="true" />
            </div>
            <h3 className="modal-title" style={{ textAlign: "center", marginTop: "12px" }}>
              Hapus pertanyaan?
            </h3>
            <p style={{ textAlign: "center", fontSize: "13px", color: "var(--color-text-secondary, #9a9488)", margin: "8px 0 20px" }}>Tindakan ini tidak bisa dibatalkan.</p>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>
                Batal
              </button>
              <button className="btn-danger" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <i className="ti ti-loader-2 spin" aria-hidden="true" /> Menghapus...
                  </>
                ) : (
                  "Ya, hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
