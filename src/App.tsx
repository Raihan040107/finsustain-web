import { useState } from "react";
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
import "./index.css";

export type PageName =
  | "home" | "dashboard" | "login" | "register" | "upload"
  | "step1" | "step2" | "step3" | "step4" | "analisis" | "pengajuan-kredit" | "riwayat" | "portofolio";

export interface BusinessData {
  id: string;
  namaUsaha: string;
  tanggalDiajukan: string;
  status: "Dalam Proses" | "Diverifikasi";
}

const validPages: PageName[] = [
  "home", "dashboard", "login", "register", "upload",
  "step1", "step2", "step3", "step4", "analisis", "pengajuan-kredit", "riwayat", "portofolio",
];

function isValidPageName(page: string): page is PageName {
  return validPages.includes(page as PageName);
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageName>(() => {
    const savedPage = localStorage.getItem("activePage");
    return savedPage && isValidPageName(savedPage) ? savedPage : "home";
  });

  const [businessList, setBusinessList] = useState<BusinessData[]>([
    { id: "1", namaUsaha: "PT Tekno Hijau Sejahtera", tanggalDiajukan: "25 Mei 2026", status: "Diverifikasi" },
    { id: "2", namaUsaha: "CV Sinar Mandiri", tanggalDiajukan: "21 Mei 2026", status: "Dalam Proses" },
  ]);
  const [activeBusinessName, setActiveBusinessName] = useState<string>("");

  const navigate = (page: PageName) => {
    setCurrentPage(page);
    localStorage.setItem("activePage", page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#2d2d2d] text-white font-body antialiased overflow-x-hidden relative">
      
      {currentPage === "login" || currentPage === "register" ? (
        <div className="w-full h-screen overflow-hidden relative">
          
          <div 
            // ✨ Hapus class duration Tailwind di sini biar nggak bentrok
            className="flex w-[200%] h-full transition-transform will-change-transform"
            style={{ 
              transform: currentPage === "login" ? "translateX(0%)" : "translateX(-50%)",
              // ✨ INI YANG DIUBAH: Durasi animasi di-set manual ke 800ms (0.8 detik)
              transitionDuration: "800ms", 
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" 
            }}
          >
            <div className="w-1/2 h-full shrink-0 overflow-y-auto">
              <Login navigate={navigate} />
            </div>
            
            <div className="w-1/2 h-full shrink-0 overflow-y-auto">
              <Register navigate={navigate} />
            </div>
          </div>

        </div>
      ) : (
        
        <div className="w-full min-h-screen">
          {(() => {
            switch (currentPage) {
              case "home": return <Index navigate={navigate} />;
              case "dashboard": return <Dashboard Maps={navigate} businessList={businessList} setBusinessList={setBusinessList} setActiveBusinessName={setActiveBusinessName} />;
              case "upload": return <TambahUsaha isOpen={true} onClose={() => navigate("dashboard")} setBusinessList={setBusinessList} />;
              case "step1": case "step2": case "step3": case "step4": 
                const stepNum = parseInt(currentPage.replace("step", "")) as 1 | 2 | 3 | 4;
                return <FormPertanyaan navigate={navigate} step={stepNum} />;
              case "analisis": return <AnalisisESG navigate={navigate} namaUsaha={activeBusinessName} />;
              case "pengajuan-kredit": return <PengajuanKreditHijau navigate={navigate} namaUsaha={activeBusinessName} />;
              case "riwayat": return <RiwayatEvaluasi navigate={navigate} businessList={businessList} />;
              case "portofolio": return <PortofolioUsaha navigate={navigate} businessList={businessList} />;
              default: return <Index navigate={navigate} />;
            }
          })()}
        </div>
      )}

    </div>
  );
}