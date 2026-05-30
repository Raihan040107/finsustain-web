import { useState } from "react";
import type { AdminUsaha } from "../../types";
import api from "../../lib/api";

type VerifikasiUsahaPageProps = {
  usaha: AdminUsaha[];
  onUpdated: () => Promise<void>;
};

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

export default function VerifikasiUsahaPage({ usaha, onUpdated }: VerifikasiUsahaPageProps) {
  const [savingId, setSavingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  async function updateStatus(idUsaha: number, status: "terverifikasi" | "ditolak" | "menunggu") {
    try {
      setSavingId(idUsaha);
      setMessage(null);
      await api.put(`/admin/usaha/${idUsaha}/verifikasi`, {
        status_verifikasi: status,
      });
      await onUpdated();
      setMessage({ text: "Status verifikasi usaha berhasil diperbarui.", ok: true });
    } catch {
      setMessage({ text: "Gagal memperbarui status verifikasi.", ok: false });
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="page-content page-wide">
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
                        <span>KTP: {item.ktp ? "ada" : "-"}</span>
                        <span>NPWP: {item.npwp ? "ada" : "-"}</span>
                        <span>NIB/SIUP: {item.surat_izin_usaha ? "ada" : "-"}</span>
                      </div>
                    </td>
                    <td>
                      <span className={statusClass(item.status_verifikasi)}>{STATUS_LABEL[item.status_verifikasi] ?? item.status_verifikasi}</span>
                      <div className="text-muted mt-1">{formatDate(item.tanggal_verifikasi)}</div>
                    </td>
                    <td className="text-muted">
                      {item.skor_total ? `${Math.round(Number(item.skor_total))} - ${item.kategori_skor ?? "-"}` : "-"}
                    </td>
                    <td>
                      <div className="action-btns left">
                        <button className="btn-small btn-approve" disabled={savingId === item.id_usaha} onClick={() => updateStatus(item.id_usaha, "terverifikasi")}>
                          Verifikasi
                        </button>
                        <button className="btn-small btn-reject" disabled={savingId === item.id_usaha} onClick={() => updateStatus(item.id_usaha, "ditolak")}>
                          Tolak
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
    </div>
  );
}
