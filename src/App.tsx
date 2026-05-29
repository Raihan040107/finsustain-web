import { useEffect, useState } from "react";
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
  namaUsaha: string;
  tanggalDiajukan: string;
  status: "Dalam Proses" | "Diverifikasi";
}

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

  const found = Object.entries(pageRoutes).find(([_, path]) => path === currentPath);

  return found ? (found[0] as PageName) : "home";
}

export default function App() {
  /* =========================================================
     ✨ CURRENT PAGE
  ========================================================= */

  const [currentPage, setCurrentPage] = useState<PageName>(getPageFromUrl);

  /* =========================================================
     ✨ BUSINESS DATA
  ========================================================= */

  const [businessList, setBusinessList] = useState<BusinessData[]>([
    {
      id: "1",
      namaUsaha: "PT Tekno Hijau Sejahtera",
      tanggalDiajukan: "25 Mei 2026",
      status: "Diverifikasi",
    },
    {
      id: "2",
      namaUsaha: "CV Sinar Mandiri",
      tanggalDiajukan: "21 Mei 2026",
      status: "Dalam Proses",
    },
  ]);

  const [activeBusinessName, setActiveBusinessName] = useState<string>("");

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
    setCurrentPage("home");
    setActiveBusinessName("");

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
                return <Dashboard Maps={navigate} businessList={businessList} setBusinessList={setBusinessList} setActiveBusinessName={setActiveBusinessName} logout={logout} />;

              /* UPLOAD */
              case "upload":
                return <TambahUsaha isOpen={true} onClose={() => navigate("dashboard")} setBusinessList={setBusinessList} />;

              /* FORM STEPS */
              case "step1":
              case "step2":
              case "step3":
              case "step4":
                const stepNum = parseInt(currentPage.replace("step", "")) as 1 | 2 | 3 | 4;

                return <FormPertanyaan navigate={navigate} step={stepNum} />;

              /* ANALISIS */
              case "analisis":
                return <AnalisisESG navigate={navigate} namaUsaha={activeBusinessName} />;

              /* PENGAJUAN */
              case "pengajuan-kredit":
                return <PengajuanKreditHijau navigate={navigate} namaUsaha={activeBusinessName} />;

              /* RIWAYAT */
              case "riwayat":
                return <RiwayatEvaluasi navigate={navigate} businessList={businessList} logout={logout} />;

              /* PORTOFOLIO */
              case "portofolio":
                return <PortofolioUsaha navigate={navigate} businessList={businessList} logout={logout} />;

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
