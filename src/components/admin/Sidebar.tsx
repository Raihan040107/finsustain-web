import type { NavGroup } from "../../types";

type SidebarProps = {
  activePage: string;
  onNavigate: (page: string) => void;
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Umum",
    items: [{ key: "overview", label: "Overview", icon: "layout-dashboard" }],
  },
  {
    label: "Manajemen Konten",
    items: [
      { key: "pertanyaan", label: "Pertanyaan", icon: "message-circle" },
      { key: "artikel", label: "Artikel", icon: "file-text" },
      { key: "kategori", label: "Kategori", icon: "tag" },
    ],
  },
  {
    label: "Manajemen Pengguna",
    items: [
      { key: "verifikasi", label: "Verifikasi Usaha", icon: "building" },
      { key: "users", label: "Daftar User", icon: "users" },
      { key: "roles", label: "Role & Akses", icon: "shield" },
    ],
  },
  {
    label: "Sistem",
    items: [
      { key: "settings", label: "Pengaturan", icon: "settings" },
      { key: "logs", label: "Log Aktivitas", icon: "activity" },
    ],
  },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <p className="sidebar-brand-label">Panel Admin</p>
        <h1 className="sidebar-brand-title">Dashboard</h1>
      </div>

      {NAV_GROUPS.map((group) => (
        <nav key={group.label} className="nav-section">
          <p className="nav-group-label">{group.label}</p>
          {group.items.map((item) => (
            <button key={item.key} className={`nav-item ${activePage === item.key ? "active" : ""}`} onClick={() => onNavigate(item.key)}>
              <i className={`ti ti-${item.icon}`} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>
      ))}
    </aside>
  );
}
