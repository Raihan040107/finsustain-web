import { useEffect } from "react";

export type ToastType = "success" | "warning" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: {
      bg: "bg-[#2a1f1a]/90 border-[#ea580c]/40 text-orange-200 shadow-orange-950/50",
      icon: (
        <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Berhasil",
    },
    warning: {
      bg: "bg-[#2a241a]/90 border-amber-500/40 text-amber-200 shadow-amber-950/50",
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      title: "Perhatian",
    },
    error: {
      bg: "bg-[#2a1a1a]/90 border-rose-500/40 text-rose-200 shadow-rose-950/50",
      icon: (
        <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Gagal",
    },
    info: {
      bg: "bg-[#1a212a]/90 border-sky-500/40 text-sky-200 shadow-sky-950/50",
      icon: (
        <svg className="w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Informasi",
    },
  };

  const currentStyle = styles[type];

  return (
    <div 
      className={`fixed top-5 right-5 z-[9999] flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl max-w-sm w-full border-solid ${currentStyle.bg}`}
      style={{
        animation: "toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards"
      }}
    >
      <div className="mt-0.5 shrink-0">{currentStyle.icon}</div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold tracking-wide uppercase text-white/90">
          {currentStyle.title}
        </h4>
        <p className="text-xs mt-0.5 text-white/70 leading-relaxed">{message}</p>
      </div>
      <button 
        onClick={onClose} 
        className="text-white/40 hover:text-white/80 transition-colors p-0.5 rounded-lg hover:bg-white/5"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}