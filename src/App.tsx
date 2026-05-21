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

// Definisi tipe string halaman resmi aplikasi (ditambahkan 'analisis')
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

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("home");

  // 3. State global untuk menyimpan profil usaha dari halaman TambahUsaha
  const [businessData, setBusinessData] = useState({
    namaUsaha: "Toko Sinar Mentari", // Nama default sesuai use case kelompok lu
    bidangUsaha: "",
    alamatUsaha: ""
  });

  const navigate = (page: PageName) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Layar otomatis kembali ke atas saat pindah halaman
  };

  // Router pengkondisian komponen aktif
  switch (currentPage) {
    case "home":
      return <Index navigate={navigate} />;
    case "dashboard":
      return <Dashboard navigate={navigate} />;
    case "login":
      return <Login navigate={navigate} />;
    case "register":
      return <Register navigate={navigate} />;
    case "upload":
      // 4. Oper fungsi setGlobalBusiness ke komponen TambahUsaha
      return (
        <TambahUsaha 
          navigate={navigate} 
          setGlobalBusiness={(data) => setBusinessData(data)} 
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
          namaUsaha={businessData.namaUsaha} 
        />
      );
    case "pengajuan-kredit":
      return (
        <PengajuanKreditHijau 
          navigate={navigate} 
          namaUsaha={businessData.namaUsaha}
        />
      );

    default:
      return <Index navigate={navigate} />;
  }
}