import { useEffect, useState } from "react";
import api from "../../lib/api";
import type { AdminUsaha, Pertanyaan, User } from "../../types";

import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import OverviewPage from "./OverviewPage";
import PertanyaanPage from "./AdminPertanyaan";
import UsersPage from "./UsersPage";
import ComingSoonPage from "./ComingSoonPage";
import VerifikasiUsahaPage from "./VerifikasiUsahaPage";
import EditFaqPage from "./EditFaqPage";
import EditStudiKasusPage from "./EditStudiKasusPage";

import "../../styles/admin.css";

type PageKey = "overview" | "pertanyaan" | "verifikasi" | "faq" | "studi-kasus" | "kategori" | "users" | "roles" | "settings" | "logs";

const PAGE_META: Record<PageKey, { title: string; subtitle: string }> = {
  overview: {
    title: "Overview",
    subtitle: "Ringkasan sistem",
  },
  pertanyaan: {
    title: "Manajemen Pertanyaan",
    subtitle: "Konten › Pertanyaan",
  },
  verifikasi: {
    title: "Verifikasi Usaha",
    subtitle: "Pengguna › Verifikasi Dokumen",
  },
  faq: {
    title: "Edit FAQ",
    subtitle: "Konten › Pertanyaan Umum",
  },
  "studi-kasus": {
    title: "Edit Studi Kasus",
    subtitle: "Konten › Studi Kasus",
  },
  kategori: {
    title: "Kategori",
    subtitle: "Konten › Kategori",
  },
  users: {
    title: "Manajemen User",
    subtitle: "Pengguna › Daftar User",
  },
  roles: {
    title: "Role & Akses",
    subtitle: "Pengguna › Role",
  },
  settings: {
    title: "Pengaturan",
    subtitle: "Sistem › Pengaturan",
  },
  logs: {
    title: "Log Aktivitas",
    subtitle: "Sistem › Log",
  },
};

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState<PageKey>("overview");

  const [pertanyaan, setPertanyaan] = useState<Pertanyaan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [usaha, setUsaha] = useState<AdminUsaha[]>([]);
  const [isReady, setIsReady] = useState(false);

  async function loadPertanyaan() {
    const res = await api.get<{ data: Pertanyaan[] }>("/pertanyaan");
    setPertanyaan(res.data.data);
  }

  async function loadUsers() {
    try {
      const res = await api.get<{ data: User[] }>("/admin/users");
      setUsers(res.data.data);
    } catch {
      // endpoint users mungkin belum ada
    }
  }

  async function loadUsaha() {
    const res = await api.get<{ data: AdminUsaha[] }>("/admin/usaha");
    setUsaha(res.data.data);
  }

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.replace("/login/admin");
        return;
      }
      try {
        const me = await api.get<{ user: { id_role: number } }>("/me");
        if (me.data.user.id_role !== 2) {
          localStorage.removeItem("token");
          window.location.replace("/login/admin");
          return;
        }
        if (!cancelled) setIsReady(true);
        await Promise.allSettled([loadPertanyaan(), loadUsers(), loadUsaha()]);
      } catch {
        localStorage.removeItem("token");
        window.location.replace("/login/admin");
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    try {
      await api.post("/logout");
    } finally {
      localStorage.removeItem("token");
      window.location.replace("/login/admin");
    }
  }

  if (!isReady) return null;

  const meta = PAGE_META[activePage];

  function renderPage() {
    switch (activePage) {
      case "overview":
        return <OverviewPage totalPertanyaan={pertanyaan.length} users={users} usaha={usaha} />;
      case "pertanyaan":
        return <PertanyaanPage />;
      case "users":
        return <UsersPage users={users} />;
      case "verifikasi":
        return <VerifikasiUsahaPage usaha={usaha} onUpdated={loadUsaha} />;
      case "faq":
        return <EditFaqPage />;
      case "studi-kasus":
        return <EditStudiKasusPage />;

      case "kategori":
        return <ComingSoonPage icon="tag" label="Manajemen Kategori" />;

      case "roles":
        return <ComingSoonPage icon="shield" label="Role & Akses" />;

      case "settings":
        return <ComingSoonPage icon="settings" label="Pengaturan" />;

      case "logs":
        return <ComingSoonPage icon="activity" label="Log Aktivitas" />;
    }
  }

  return (
    <div className="admin-shell">
      <Sidebar activePage={activePage} onNavigate={(page) => setActivePage(page as PageKey)} />
      <div className="admin-main">
        <Topbar title={meta.title} subtitle={meta.subtitle} onLogout={handleLogout} />
        <main className="admin-content">{renderPage()}</main>
      </div>
    </div>
  );
}
