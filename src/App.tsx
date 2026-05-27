import { useState } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TambahUsaha from "./pages/TambahUsaha";
import FormPertanyaan from "./pages/FormPertanyaan";
import AnalisisESG from "./pages/AnalisisESG";
import PengajuanKreditHijau from "./pages/PengajuanKreditHijau";
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
  | "pengajuan-kredit";

export interface BusinessData {
  id: string;
  namaUsaha: string;
  tanggalDiajukan: string;
  status: "Dalam Proses" | "Diverifikasi";
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("home");

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

  const navigate = (page: PageName) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  switch (currentPage) {
    case "home":
      return <Index navigate={navigate} />;
    case "dashboard":
      return (
        <Dashboard 
          navigate={navigate} 
          businessList={businessList}
          setBusinessList={setBusinessList} // <--- DI SINI KUNCI PERBAIKANNYA!
          setActiveBusinessName={setActiveBusinessName}
        />
      );
    case "login":
      return <Login navigate={navigate} />;
    case "register":
      return <Register navigate={navigate} />;
    case "upload":
      return (
        <TambahUsaha 
          isOpen={true}
          onClose={() => navigate("dashboard")}
          setBusinessList={setBusinessList} 
        />
      );
    case "step1":
      return <FormPertanyaan navigate={navigate} step={1} />;
    case "step2":
      return <FormPertanyaan navigate={navigate} step={2} />;
    case "step3":
      return <FormPertanyaan navigate={navigate} step={3} />;
    case "step4":
      return <FormPertanyaan navigate={navigate} step={4} />;
    case "analisis":
      return (
        <AnalisisESG 
          navigate={navigate} 
          namaUsaha={activeBusinessName} 
        />
      );
    case "pengajuan-kredit":
      return (
        <PengajuanKreditHijau 
          navigate={navigate} 
          namaUsaha={activeBusinessName}
        />
      );
    default:
      return <Index navigate={navigate} />;
  }
}