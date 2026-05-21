type OverviewPageProps = {
  totalPertanyaan: number;
};

const RECENT_ACTIVITY = [
  { icon: "plus", text: "Pertanyaan baru ditambahkan", time: "2 menit lalu" },
  { icon: "user", text: "User baru terdaftar", time: "15 menit lalu" },
  { icon: "edit", text: "Pertanyaan #12 diperbarui", time: "1 jam lalu" },
];

export default function OverviewPage({ totalPertanyaan }: OverviewPageProps) {
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
          <p className="stat-value">38</p>
          <p className="stat-sub">Terdaftar</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Admin</p>
          <p className="stat-value">3</p>
          <p className="stat-sub">Role aktif</p>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Aktivitas terbaru</h3>
        <div className="activity-list">
          {RECENT_ACTIVITY.map((item, i) => (
            <div key={i} className="activity-item">
              <span className="activity-icon">
                <i className={`ti ti-${item.icon}`} aria-hidden="true" />
              </span>
              <span className="activity-text">{item.text}</span>
              <span className="activity-time">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
