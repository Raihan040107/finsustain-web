type ComingSoonPageProps = {
  icon: string;
  label: string;
};

export default function ComingSoonPage({ icon, label }: ComingSoonPageProps) {
  return (
    <div className="page-content">
      <div className="card">
        <div className="empty-state">
          <i className={`ti ti-${icon}`} aria-hidden="true" />
          <p>{label} belum tersedia.</p>
        </div>
      </div>
    </div>
  );
}
