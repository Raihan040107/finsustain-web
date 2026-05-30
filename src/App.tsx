import { useCallback, useEffect, useState } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TambahUsaha from "./pages/TambahUsaha";
import FormPertanyaan from "./pages/FormPertanyaan";
import AnalisisESG from "./pages/AnalisisESG";
import PengajuanKreditHijau from "./pages/PengajuanKreditHijau";
import RiwayatEvaluasi from "./pages/RiwayatEvaluasi";
import PortofolioUsaha from "./pages/PortofolioUsaha";

// ✨ Admin
import LoginAdmin from "./pages/LoginAdmin";
import DashboardAdmin from "./pages/admin/AdminDashboard";
import api from "./lib/api";
import type { User } from "./types";

import "./index.css";

export type PageName =
  | "home"
  | "dashboard"
  | "login"
  | "register"
  | "upload"
  | "step1"
  | "step2"
  | "step3"
  | "step4"
  | "analisis"
  | "pengajuan-kredit"
  | "riwayat"
  | "portofolio"
  | "login-admin"
  | "dashboard-admin";

export interface BusinessData {
  id: string;
  idUsaha: number;
  namaUsaha: string;
  bidangUsaha: string;
  alamat: string;
  tanggalDiajukan: string;
  status: "Dalam Proses" | "Diverifikasi" | "Ditolak";
  rawStatus: "menunggu" | "terverifikasi" | "ditolak" | string;
  skorEnvironmental?: number | null;
  skorSocial?: number | null;
  skorGovernance?: number | null;
  skorTotal?: number | null;
  kategoriSkor?: string | null;
  tanggalVerifikasi?: string;
  tanggalEvaluasi?: string;
}

type ApiUsaha = {
  id_usaha: number;
  nama_usaha: string;
  bidang_usaha: string;
  alamat: string;
  status_verifikasi?: string | null;
  tanggal_registrasi?: string | null;
  skor_environmental?: number | string | null;
  skor_social?: number | string | null;
  skor_governance?: number | string | null;
  skor_total?: number | string | null;
  kategori_skor?: string | null;
  tanggal_verifikasi?: string | null;
  tanggal_perhitungan?: string | null;
};

/* =========================================================
   ✨ ROUTE MAPPING
========================================================= */

const pageRoutes: Record<PageName, string> = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  upload: "/upload",

  step1: "/step1",
  step2: "/step2",
  step3: "/step3",
  step4: "/step4",

  analisis: "/analisis",
  "pengajuan-kredit": "/pengajuan-kredit",
  riwayat: "/riwayat",
  portofolio: "/portofolio",

  "login-admin": "/login/admin",
  "dashboard-admin": "/dashboard/admin",
};

/* =========================================================
   ✨ GET PAGE FROM URL
========================================================= */

function getPageFromUrl(): PageName {
  const currentPath = window.location.pathname;

  const found = Object.entries(pageRoutes).find((entry) => entry[1] === currentPath);

  return found ? (found[0] as PageName) : "home";
}

function formatDate(date?: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function mapStatus(status?: string | null): BusinessData["status"] {
  if (status === "terverifikasi") return "Diverifikasi";
  if (status === "ditolak") return "Ditolak";
  return "Dalam Proses";
}

function numberOrNull(value: ApiUsaha["skor_total"]) {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function mapBusiness(item: ApiUsaha): BusinessData {
  return {
    id: String(item.id_usaha),
    idUsaha: item.id_usaha,
    namaUsaha: item.nama_usaha,
    bidangUsaha: item.bidang_usaha,
    alamat: item.alamat,
    tanggalDiajukan: formatDate(item.tanggal_registrasi),
    status: mapStatus(item.status_verifikasi),
    rawStatus: item.status_verifikasi ?? "menunggu",
    skorEnvironmental: numberOrNull(item.skor_environmental),
    skorSocial: numberOrNull(item.skor_social),
    skorGovernance: numberOrNull(item.skor_governance),
    skorTotal: numberOrNull(item.skor_total),
    kategoriSkor: item.kategori_skor ?? null,
    tanggalVerifikasi: formatDate(item.tanggal_verifikasi),
    tanggalEvaluasi: formatDate(item.tanggal_perhitungan),
  };
}

const BUSINESS_DATA_PAGES: PageName[] = ["dashboard", "portofolio", "riwayat"];

export default function App() {
  /* =========================================================
     ✨ CURRENT PAGE
  ========================================================= */

  const [currentPage, setCurrentPage] = useState<PageName>(getPageFromUrl);

  /* =========================================================
     ✨ BUSINESS DATA
  ========================================================= */


  const [businessList, setBusinessList] = useState<BusinessData[]>([]);
  const [hasLoadedBusinessList, setHasLoadedBusinessList] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeBusinessName, setActiveBusinessName] = useState<string>("");
  const [activeBusinessId, setActiveBusinessId] = useState<number | null>(() => {
    const saved = Number(localStorage.getItem("active_usaha_id"));
    return Number.isFinite(saved) && saved > 0 ? saved : null;
  });

  const loadBusinessList = useCallback(async (options?: { force?: boolean }) => {
    if (!localStorage.getItem("token")) return;
    if (!options?.force && hasLoadedBusinessList) return;

    const res = await api.get<{ data: ApiUsaha[] }>("/usaha");
    setBusinessList(res.data.data.map(mapBusiness));
    setHasLoadedBusinessList(true);
  }, [hasLoadedBusinessList]);

  const loadCurrentUser = useCallback(async (options?: { force?: boolean }) => {
    if (!localStorage.getItem("token")) return;
    if (!options?.force && currentUser) return;

    const res = await api.get<{
      user: {
        user_id: number;
        nama: string;
        email: string;
        id_role: number;
      };
    }>("/me");

    setCurrentUser({
      id: res.data.user.user_id,
      name: res.data.user.nama,
      email: res.data.user.email,
      id_role: res.data.user.id_role,
      created_at: null,
    });
  }, [currentUser]);

  const setActiveBusiness = (business: BusinessData) => {
    setActiveBusinessId(business.idUsaha);
    setActiveBusinessName(business.namaUsaha);
    localStorage.setItem("active_usaha_id", String(business.idUsaha));
    localStorage.setItem("active_usaha_name", business.namaUsaha);
  };

  /* =========================================================
     ✨ HANDLE BACK/FORWARD BROWSER
  ========================================================= */

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromUrl());
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (BUSINESS_DATA_PAGES.includes(currentPage)) {
      let cancelled = false;

      queueMicrotask(() => {
        if (cancelled) return;

        Promise.allSettled([loadBusinessList(), loadCurrentUser()]).then((results) => {
          if (cancelled) return;

          if (results[0].status === "rejected") {
            setBusinessList([]);
            setHasLoadedBusinessList(false);
          }
        });
      });

      return () => {
        cancelled = true;
      };
    }
  }, [currentPage, loadBusinessList, loadCurrentUser]);

  /* =========================================================
     ✨ NAVIGATE
  ========================================================= */

  const navigate = (page: PageName) => {
    setCurrentPage(page);

    window.history.pushState({}, "", pageRoutes[page]);

    window.scrollTo(0, 0);
  };

  /* =========================================================
     ✨ LOGOUT
  ========================================================= */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("active_usaha_id");
    localStorage.removeItem("active_usaha_name");
    setCurrentPage("home");
    setActiveBusinessName("");
    setActiveBusinessId(null);
    setCurrentUser(null);
    setBusinessList([]);
    setHasLoadedBusinessList(false);

    window.history.pushState({}, "", "/");

    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#2d2d2d] text-white font-body antialiased overflow-x-hidden relative">
      {/* =========================================================
          LOGIN & REGISTER SLIDER
      ========================================================= */}

      {currentPage === "login" || currentPage === "register" ? (
        <div className="w-full h-screen overflow-hidden relative">
          <div
            className="flex w-[200%] h-full transition-transform will-change-transform"
            style={{
              transform: currentPage === "login" ? "translateX(0%)" : "translateX(-50%)",

              transitionDuration: "800ms",

              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* LOGIN */}
            <div className="w-1/2 h-full shrink-0 overflow-y-auto">
              <Login navigate={navigate} />
            </div>

            {/* REGISTER */}
            <div className="w-1/2 h-full shrink-0 overflow-y-auto">
              <Register navigate={navigate} />
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================
            ALL OTHER PAGES
        ========================================================= */

        <div className="w-full min-h-screen">
          {(() => {
            switch (currentPage) {
              /* HOME */
              case "home":
                return <Index navigate={navigate} />;

              /* USER DASHBOARD */
              case "dashboard":
                return <Dashboard Maps={navigate} businessList={businessList} setBusinessList={setBusinessList} setActiveBusiness={setActiveBusiness} refreshBusinessList={() => loadBusinessList({ force: true })} logout={logout} currentUser={currentUser} />;

              /* UPLOAD */
              case "upload":
                return <TambahUsaha isOpen={true} onClose={() => navigate("dashboard")} setBusinessList={setBusinessList} onCreated={() => loadBusinessList({ force: true })} />;

              case "step1":
              case "step2":
              case "step3":
              case "step4": {
                const stepNum = parseInt(currentPage.replace("step", "")) as 1 | 2 | 3 | 4;

                return <FormPertanyaan key={currentPage} navigate={navigate} step={stepNum} idUsaha={activeBusinessId} refreshBusinessList={() => loadBusinessList({ force: true })} />;
              }

              /* ANALISIS */
              case "analisis":
                return <AnalisisESG navigate={navigate} namaUsaha={activeBusinessName || localStorage.getItem("active_usaha_name") || ""} idUsaha={activeBusinessId} />;

              /* PENGAJUAN */
              case "pengajuan-kredit":
                return <PengajuanKreditHijau navigate={navigate} namaUsaha={activeBusinessName || localStorage.getItem("active_usaha_name") || ""} idUsaha={activeBusinessId} />;

              /* RIWAYAT */
              case "riwayat":
                return <RiwayatEvaluasi navigate={navigate} businessList={businessList} logout={logout} currentUser={currentUser} />;

              /* PORTOFOLIO */
              case "portofolio":
                return <PortofolioUsaha navigate={navigate} businessList={businessList} logout={logout} currentUser={currentUser} />;

              /* ADMIN LOGIN */
              case "login-admin":
                return <LoginAdmin />;

              /* ADMIN DASHBOARD */
              case "dashboard-admin":
                return <DashboardAdmin />;

              /* DEFAULT */
              default:
                return <Index navigate={navigate} />;
            }
          })()}
        </div>
      )}
    </div>
  );
}
