import type { AdminUsaha, User } from "../../types";

type OverviewPageProps = {
  totalPertanyaan: number;
  users: User[];
  usaha: AdminUsaha[];
};

function latestActivities(usaha: AdminUsaha[], users: User[]) {
  const usahaItems = usaha.slice(0, 4).map((item) => ({
    icon: item.status_verifikasi === "terverifikasi" ? "circle-check" : item.status_verifikasi === "ditolak" ? "circle-x" : "clock",
    text: `${item.nama_usaha} - ${item.status_verifikasi}`,
    time: item.tanggal_verifikasi || item.tanggal_registrasi || "-",
  }));

  const userItems = users.slice(0, 2).map((user) => ({
    icon: "user",
    text: `${user.name} terdaftar sebagai ${user.id_role === 2 ? "admin" : "user"}`,
    time: user.email,
  }));

  return [...usahaItems, ...userItems];
}

export default function OverviewPage({ totalPertanyaan, users, usaha }: OverviewPageProps) {
  const totalAdmin = users.filter((user) => user.id_role === 2).length;
  const menunggu = usaha.filter((item) => item.status_verifikasi === "menunggu").length;
  const activities = latestActivities(usaha, users);

  return (
    <div className="page-content">
      <div className="stat-grid">
        <div className="stat-card">
          <p className="stat-label">Total Pertanyaan</p>
          <p className="stat-value">{totalPertanyaan}</p>
          <p className="stat-sub">Aktif di sistem</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total User</p>
          <p className="stat-value">{users.length}</p>
          <p className="stat-sub">{totalAdmin} admin aktif</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Menunggu Verifikasi</p>
          <p className="stat-value">{menunggu}</p>
          <p className="stat-sub">Dari {usaha.length} usaha</p>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Aktivitas terbaru</h3>
        {activities.length === 0 ? (
          <div className="empty-state">
            <i className="ti ti-activity" aria-hidden="true" />
            <p>Belum ada aktivitas dari database.</p>
          </div>
        ) : (
          <div className="activity-list">
            {activities.map((item, i) => (
              <div key={`${item.text}-${i}`} className="activity-item">
                <span className="activity-icon">
                  <i className={`ti ti-${item.icon}`} aria-hidden="true" />
                </span>
                <span className="activity-text">{item.text}</span>
                <span className="activity-time">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
