type TopbarProps = {
  title: string;
  subtitle: string;
  onLogout: () => void;
};

export default function Topbar({ title, subtitle, onLogout }: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <h2 className="topbar-title">{title}</h2>
        <p className="topbar-subtitle">{subtitle}</p>
      </div>
      <button className="btn-logout" onClick={onLogout}>
        <i className="ti ti-logout" aria-hidden="true" />
        Logout
      </button>
    </header>
  );
}
