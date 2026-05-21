import { useState } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TambahUsaha from "./pages/TambahUsaha";
import FormPertanyaan from "./pages/FormPertanyaan";
import "./index.css";

// Tipe navigasi string untuk validasi antar halaman
export type PageName =
  | "home"
  | "dashboard"
  | "login"
  | "register"
  | "upload"
  | "step1"
  | "step2"
  | "step3"
  | "step4";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageName>("home");

  const navigate = (page: PageName) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Otomatis balik ke atas layar saat pindah halaman
  };

  // Navigasi Router Berdasarkan State Kondisional
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
      return <TambahUsaha navigate={navigate} />;
    case "step1":
      return <FormPertanyaan navigate={navigate} step={1} />;
    case "step2":
      return <FormPertanyaan navigate={navigate} step={2} />;
    case "step3":
      return <FormPertanyaan navigate={navigate} step={3} />;
    case "step4":
      return <FormPertanyaan navigate={navigate} step={4} />;
    default:
      return <Index navigate={navigate} />;
  }
}