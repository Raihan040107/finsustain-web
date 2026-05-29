import { useEffect, useState } from "react";
import api from "../../lib/api";
import type { Pertanyaan, User } from "../../types";

import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import OverviewPage from "./OverviewPage";
import PertanyaanPage from "./AdminPertanyaan";
import UsersPage from "./UsersPage";
import ComingSoonPage from "./ComingSoonPage";

import "../../styles/admin.css";

type PageKey = "overview" | "pertanyaan" | "artikel" | "kategori" | "users" | "roles" | "settings" | "logs";

const PAGE_META: Record<PageKey, { title: string; subtitle: string }> = {
  overview: {
    title: "Overview",
    subtitle: "Ringkasan sistem",
  },

  pertanyaan: {
    title: "Manajemen Pertanyaan",
    subtitle: "Konten › Pertanyaan",
  },

  artikel: {
    title: "Artikel",
    subtitle: "Konten › Artikel",
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

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [isLoading, setIsLoading] = useState(true);

  async function loadPertanyaan() {
    const res = await api.get<{
      data: Pertanyaan[];
    }>("/pertanyaan");

    setPertanyaan(res.data.data);
  }

  async function loadUsers() {
    try {
      const res = await api.get<{
        data: User[];
      }>("/admin/users");

      setUsers(res.data.data);
    } catch {
      // endpoint users mungkin belum ada
    }
  }

  useEffect(() => {
    async function init() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.replace("/login/admin");

          return;
        }

        const me = await api.get("/me");

        if (me.data.user.id_role !== 2) {
          localStorage.removeItem("token");

          window.location.replace("/login/admin");

          return;
        }

        setIsCheckingAuth(false);

        await Promise.all([loadPertanyaan(), loadUsers()]);
      } catch {
        localStorage.removeItem("token");

        window.location.replace("/login/admin");
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  async function handleLogout() {
    try {
      await api.post("/logout");
    } finally {
      localStorage.removeItem("token");

      window.location.replace("/login/admin");
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="admin-loading">
        <i className="ti ti-loader-2 spin" aria-hidden="true" />
        <p>Memverifikasi akses...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="admin-loading">
        <i className="ti ti-loader-2 spin" aria-hidden="true" />
        <p>Memuat data...</p>
      </div>
    );
  }

  const meta = PAGE_META[activePage];

  function renderPage() {
    switch (activePage) {
      case "overview":
        return <OverviewPage totalPertanyaan={pertanyaan.length} />;

      case "pertanyaan":
        return <PertanyaanPage />;

      case "users":
        return <UsersPage users={users} />;

      case "artikel":
        return <ComingSoonPage icon="file-text" label="Manajemen Artikel" />;

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
