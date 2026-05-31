// import { useState, useEffect, useCallback, useRef } from "react";
// import api from "../../lib/api";

// // ── Types ─────────────────────────────────────────────────────────────────────

// interface FAQItem {
//   id: number;
//   question: string;
//   answer: string;
//   order: number;
//   is_active: boolean;
// }

// type ModalMode = "add" | "edit" | null;

// // ── EditFaqPage ───────────────────────────────────────────────────────────────

// export default function EditFaqPage() {
//   const [faqs, setFaqs] = useState<FAQItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "warning" } | null>(null);
//   const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const [modalMode, setModalMode] = useState<ModalMode>(null);
//   const [editTarget, setEditTarget] = useState<FAQItem | null>(null);
//   const [formQuestion, setFormQuestion] = useState("");
//   const [formAnswer, setFormAnswer] = useState("");
//   const [deleteTarget, setDeleteTarget] = useState<FAQItem | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   const [dragFromIndex, setDragFromIndex] = useState<number | null>(null);
//   const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

//   // ── Toast ──────────────────────────────────────────────────────────────────

//   const showToast = (msg: string, type: "success" | "error" | "warning" = "success") => {
//     if (toastTimer.current) clearTimeout(toastTimer.current);
//     setToast({ msg, type });
//     toastTimer.current = setTimeout(() => setToast(null), 3500);
//   };

//   // ── API ────────────────────────────────────────────────────────────────────

//   const fetchFAQs = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await api.get<{ data: FAQItem[] }>("/admin/faqs");
//       setFaqs(res.data.data ?? []);
//     } catch {
//       showToast("Gagal memuat data FAQ dari server.", "error");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchFAQs();
//     return () => {
//       if (toastTimer.current) clearTimeout(toastTimer.current);
//     };
//   }, [fetchFAQs]);

//   // ── Modal helpers ──────────────────────────────────────────────────────────

//   const openAdd = () => {
//     setFormQuestion("");
//     setFormAnswer("");
//     setEditTarget(null);
//     setModalMode("add");
//   };

//   const openEdit = (faq: FAQItem) => {
//     setFormQuestion(faq.question);
//     setFormAnswer(faq.answer);
//     setEditTarget(faq);
//     setModalMode("edit");
//   };

//   const closeModal = () => {
//     setModalMode(null);
//     setEditTarget(null);
//     setFormQuestion("");
//     setFormAnswer("");
//   };

//   // ── Save / Delete / Toggle ─────────────────────────────────────────────────

//   const handleSave = async () => {
//     if (!formQuestion.trim() || !formAnswer.trim()) {
//       showToast("Pertanyaan dan jawaban tidak boleh kosong.", "warning");
//       return;
//     }
//     setSaving(true);
//     try {
//       if (modalMode === "add") {
//         await api.post("/admin/faqs", {
//           question: formQuestion.trim(),
//           answer: formAnswer.trim(),
//         });
//         showToast("FAQ berhasil ditambahkan.");
//       } else if (editTarget) {
//         await api.put(`/admin/faqs/${editTarget.id}`, {
//           question: formQuestion.trim(),
//           answer: formAnswer.trim(),
//         });
//         showToast("FAQ berhasil diperbarui.");
//       }
//       closeModal();
//       fetchFAQs();
//     } catch {
//       showToast("Gagal menyimpan FAQ.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteTarget) return;
//     setSaving(true);
//     try {
//       await api.delete(`/admin/faqs/${deleteTarget.id}`);
//       showToast("FAQ berhasil dihapus.");
//       setDeleteTarget(null);
//       fetchFAQs();
//     } catch {
//       showToast("Gagal menghapus FAQ.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleToggleActive = async (faq: FAQItem) => {
//     try {
//       await api.put(`/admin/faqs/${faq.id}`, { is_active: !faq.is_active });
//       showToast(`FAQ ${!faq.is_active ? "diaktifkan" : "dinonaktifkan"}.`);
//       fetchFAQs();
//     } catch {
//       showToast("Gagal mengubah status FAQ.", "error");
//     }
//   };

//   // ── Drag & Drop ────────────────────────────────────────────────────────────

//   const handleDragStart = (index: number) => (e: React.DragEvent) => {
//     setDragFromIndex(index);
//     e.dataTransfer.effectAllowed = "move";
//   };

//   const handleDragOver = (index: number) => (e: React.DragEvent) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "move";
//     setDragOverIndex(index);
//   };

//   const handleDragLeave = () => {
//     setDragOverIndex(null);
//   };

//   const handleDrop = async (toIndex: number, e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOverIndex(null);
//     if (dragFromIndex === null || dragFromIndex === toIndex) {
//       setDragFromIndex(null);
//       return;
//     }
//     const reordered = [...faqs];
//     const [moved] = reordered.splice(dragFromIndex, 1);
//     reordered.splice(toIndex, 0, moved);
//     setFaqs(reordered);
//     setDragFromIndex(null);
//     try {
//       await api.post("/admin/faqs/reorder", { ids: reordered.map((f) => f.id) });
//       showToast("Urutan FAQ berhasil diperbarui.");
//     } catch {
//       showToast("Gagal menyimpan urutan baru.", "error");
//       fetchFAQs();
//     }
//   };

//   const handleDragEnd = () => {
//     setDragFromIndex(null);
//     setDragOverIndex(null);
//   };

//   // ── Filtered list ──────────────────────────────────────────────────────────

//   const filtered = faqs.filter(
//     (f) =>
//       f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       f.answer.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const activeCount = faqs.filter((f) => f.is_active).length;
//   const inactiveCount = faqs.filter((f) => !f.is_active).length;

//   // ── Render ─────────────────────────────────────────────────────────────────

//   return (
//     <div className="space-y-6">
//       {/* Toast */}
//       {toast && (
//         <div
//           className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-semibold border transition-all animate-in slide-in-from-bottom-4 ${
//             toast.type === "success"
//               ? "bg-[#1a2e1a] border-green-500/30 text-green-400"
//               : toast.type === "warning"
//               ? "bg-[#2e2a1a] border-yellow-500/30 text-yellow-400"
//               : "bg-[#2e1a1a] border-red-500/30 text-red-400"
//           }`}
//         >
//           {toast.type === "success" ? (
//             <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
//             </svg>
//           ) : toast.type === "warning" ? (
//             <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
//             </svg>
//           ) : (
//             <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           )}
//           {toast.msg}
//         </div>
//       )}

//       {/* Header Bar */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         {/* Stats chips */}
//         <div className="flex flex-wrap items-center gap-2">
//           <span className="inline-flex items-center gap-1.5 bg-white/[0.05] border border-white/10 text-[#b0a89e] text-xs font-semibold px-3 py-1.5 rounded-full">
//             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             {faqs.length} total FAQ
//           </span>
//           <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full">
//             <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
//             {activeCount} aktif
//           </span>
//           {inactiveCount > 0 && (
//             <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold px-3 py-1.5 rounded-full">
//               <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
//               {inactiveCount} nonaktif
//             </span>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-3">
//           {/* Search */}
//           <div className="relative">
//             <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#b0a89e]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Cari FAQ..."
//               className="pl-8 pr-4 py-2 text-xs bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-[#b0a89e]/40 focus:outline-none focus:border-[#e05c2a]/40 transition-colors w-44"
//             />
//           </div>

//           <button
//             onClick={openAdd}
//             className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] hover:shadow-[0_4px_16px_rgba(224,92,42,0.35)] transition-all"
//           >
//             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
//             </svg>
//             Tambah FAQ
//           </button>
//         </div>
//       </div>

//       {/* Info hint */}
//       <p className="text-[#b0a89e]/40 text-xs flex items-center gap-1.5 -mt-2">
//         <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
//         </svg>
//         Drag kartu untuk mengubah urutan tampil di halaman publik.
//       </p>

//       {/* Content */}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-24 gap-3">
//           <div className="w-8 h-8 border-2 border-[#e05c2a] border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-[#b0a89e]">Memuat data FAQ...</p>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="border border-white/[0.06] rounded-2xl p-16 text-center bg-white/[0.01]">
//           <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <p className="text-[#b0a89e] text-sm mb-1">
//             {searchQuery ? `Tidak ditemukan FAQ untuk "${searchQuery}"` : "Belum ada FAQ."}
//           </p>
//           {!searchQuery && (
//             <p className="text-[#b0a89e]/50 text-xs mb-5">Tambahkan FAQ pertama untuk ditampilkan di halaman publik.</p>
//           )}
//           {!searchQuery && (
//             <button
//               onClick={openAdd}
//               className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all"
//             >
//               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
//               </svg>
//               Tambah FAQ Pertama
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="space-y-2.5">
//           {filtered.map((faq, index) => (
//             <div
//               key={faq.id}
//               draggable
//               onDragStart={handleDragStart(index)}
//               onDragOver={handleDragOver(index)}
//               onDragLeave={handleDragLeave}
//               onDrop={(e) => handleDrop(index, e)}
//               onDragEnd={handleDragEnd}
//               className={`group relative border rounded-2xl p-4 flex items-start gap-4 transition-all cursor-grab active:cursor-grabbing active:scale-[0.99] active:shadow-2xl
//                 ${dragOverIndex === index && dragFromIndex !== index ? "border-[#e05c2a]/50 bg-[#e05c2a]/5 scale-[1.005]" : ""}
//                 ${dragFromIndex === index ? "opacity-40 scale-[0.98]" : ""}
//                 ${faq.is_active
//                   ? "bg-white/[0.025] border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.04]"
//                   : "bg-white/[0.01] border-white/[0.04] opacity-60 hover:opacity-80"
//                 }`}
//             >
//               {/* Drag handle */}
//               <div className="mt-1 text-[#b0a89e]/20 group-hover:text-[#b0a89e]/50 transition-colors shrink-0 pt-0.5">
//                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
//                 </svg>
//               </div>

//               {/* Nomor urut */}
//               <div className="shrink-0 w-6 h-6 rounded-lg bg-[#e05c2a]/10 border border-[#e05c2a]/20 flex items-center justify-center text-[#e05c2a] text-[10px] font-bold mt-0.5">
//                 {index + 1}
//               </div>

//               {/* Konten */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-start gap-2 flex-wrap mb-1">
//                   <p className="font-semibold text-sm text-white leading-snug flex-1 min-w-0">{faq.question}</p>
//                   {!faq.is_active && (
//                     <span className="text-[10px] font-bold bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full shrink-0 mt-0.5">
//                       Nonaktif
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-xs text-[#b0a89e] leading-relaxed line-clamp-2">{faq.answer}</p>
//               </div>

//               {/* Action buttons */}
//               <div className="flex items-center gap-1 shrink-0 mt-0.5">
//                 {/* Toggle active */}
//                 <button
//                   onClick={() => handleToggleActive(faq)}
//                   title={faq.is_active ? "Nonaktifkan" : "Aktifkan"}
//                   className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
//                     faq.is_active
//                       ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
//                       : "bg-white/[0.04] border-white/10 text-[#b0a89e] hover:text-green-400 hover:border-green-500/30"
//                   }`}
//                 >
//                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={faq.is_active ? "M5 13l4 4L19 7" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
//                   </svg>
//                 </button>

//                 {/* Edit */}
//                 <button
//                   onClick={() => openEdit(faq)}
//                   title="Edit"
//                   className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#b0a89e] hover:text-white hover:border-white/25 transition-all"
//                 >
//                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                   </svg>
//                 </button>

//                 {/* Delete */}
//                 <button
//                   onClick={() => setDeleteTarget(faq)}
//                   title="Hapus"
//                   className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#b0a89e] hover:text-red-400 hover:border-red-500/30 transition-all"
//                 >
//                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Hint hanya aktif tampil di publik */}
//       {faqs.length > 0 && !loading && (
//         <p className="text-[#b0a89e]/35 text-xs flex items-center gap-1.5">
//           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           Hanya FAQ berstatus aktif yang ditampilkan di halaman publik.
//         </p>
//       )}

//       {/* ── MODAL ADD / EDIT ──────────────────────────────────────────────── */}
//       {modalMode && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//           <div className="w-full max-w-lg bg-[#2a2a2a] border border-white/[0.09] rounded-2xl shadow-2xl overflow-hidden">
//             {/* Modal header */}
//             <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
//               <div className="flex items-center gap-2.5">
//                 <div className="w-7 h-7 rounded-lg bg-[#e05c2a]/15 border border-[#e05c2a]/25 flex items-center justify-center">
//                   <svg className="w-3.5 h-3.5 text-[#e05c2a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     {modalMode === "add" ? (
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
//                     ) : (
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                     )}
//                   </svg>
//                 </div>
//                 <h2 className="font-semibold text-sm text-white">
//                   {modalMode === "add" ? "Tambah FAQ Baru" : "Edit FAQ"}
//                 </h2>
//               </div>
//               <button
//                 onClick={closeModal}
//                 className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#b0a89e] hover:text-white transition-colors"
//               >
//                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             {/* Modal body */}
//             <div className="p-6 space-y-4">
//               <div>
//                 <label className="block text-[10px] font-bold uppercase tracking-widest text-[#b0a89e] mb-2">
//                   Pertanyaan <span className="text-[#e05c2a]">*</span>
//                 </label>
//                 <textarea
//                   value={formQuestion}
//                   onChange={(e) => setFormQuestion(e.target.value)}
//                   rows={2}
//                   placeholder="Contoh: Apa saja syarat untuk mendaftar?"
//                   className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#b0a89e]/35 focus:outline-none focus:border-[#e05c2a]/50 resize-none transition-colors leading-relaxed"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold uppercase tracking-widest text-[#b0a89e] mb-2">
//                   Jawaban <span className="text-[#e05c2a]">*</span>
//                 </label>
//                 <textarea
//                   value={formAnswer}
//                   onChange={(e) => setFormAnswer(e.target.value)}
//                   rows={5}
//                   placeholder="Tulis jawaban lengkap di sini..."
//                   className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#b0a89e]/35 focus:outline-none focus:border-[#e05c2a]/50 resize-none transition-colors leading-relaxed"
//                 />
//               </div>
//             </div>

//             {/* Modal footer */}
//             <div className="flex items-center justify-end gap-2.5 px-6 pb-5">
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-[#b0a89e] text-xs font-semibold hover:border-white/20 hover:text-white transition-all"
//               >
//                 Batal
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e05c2a] text-white text-xs font-bold hover:bg-[#f06b35] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//               >
//                 {saving ? (
//                   <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
//                   </svg>
//                 )}
//                 {saving ? "Menyimpan..." : modalMode === "add" ? "Simpan FAQ" : "Perbarui FAQ"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── MODAL DELETE ──────────────────────────────────────────────────── */}
//       {deleteTarget && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//           <div className="w-full max-w-sm bg-[#2a2a2a] border border-white/[0.09] rounded-2xl shadow-2xl p-6 text-center">
//             <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
//               <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//               </svg>
//             </div>
//             <h3 className="font-semibold text-base text-white mb-1.5">Hapus FAQ?</h3>
//             <p className="text-xs text-[#b0a89e] mb-3">FAQ berikut akan dihapus secara permanen:</p>
//             <p className="text-sm text-white font-medium mb-6 px-2 line-clamp-3 bg-white/[0.03] border border-white/[0.06] rounded-xl py-3 leading-relaxed">
//               "{deleteTarget.question}"
//             </p>
//             <div className="flex gap-2.5 justify-center">
//               <button
//                 onClick={() => setDeleteTarget(null)}
//                 className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] text-[#b0a89e] text-xs font-semibold hover:border-white/20 hover:text-white transition-all"
//               >
//                 Batal
//               </button>
//               <button
//                 onClick={handleDelete}
//                 disabled={saving}
//                 className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 disabled:opacity-50 transition-all"
//               >
//                 {saving ? (
//                   <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : "Ya, Hapus"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
