import { useState, useEffect, useCallback, useRef } from "react";
import api from "../../lib/api";

interface StudiKasusItem {
  id: number;
  nomor: string;
  nama_usaha: string;
  deskripsi: string;
  pencapaian: string[];
  order: number;
  is_active: boolean;
}

type ModalMode = "add" | "edit" | null;

export default function EditStudiKasusPage() {
  const [items, setItems] = useState<StudiKasusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "warning" } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editTarget, setEditTarget] = useState<StudiKasusItem | null>(null);
  const [formNomor, setFormNomor] = useState("");
  const [formNama, setFormNama] = useState("");
  const [formDeskripsi, setFormDeskripsi] = useState("");
  const [formPencapaian, setFormPencapaian] = useState<string[]>(["", ""]);
  const [deleteTarget, setDeleteTarget] = useState<StudiKasusItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [dragFromIndex, setDragFromIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // ── Toast ──────────────────────────────────────────────────────────────────

  const showToast = (msg: string, type: "success" | "error" | "warning" = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  // ── API ────────────────────────────────────────────────────────────────────

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: StudiKasusItem[] }>("/admin/studi-kasus");
      setItems(res.data.data ?? []);
    } catch {
      showToast("Gagal memuat data studi kasus dari server.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, [fetchItems]);

  // ── Modal helpers ──────────────────────────────────────────────────────────

  const openAdd = () => {
    setFormNomor("");
    setFormNama("");
    setFormDeskripsi("");
    setFormPencapaian(["", ""]);
    setEditTarget(null);
    setModalMode("add");
  };

  const openEdit = (item: StudiKasusItem) => {
    setFormNomor(item.nomor);
    setFormNama(item.nama_usaha);
    setFormDeskripsi(item.deskripsi);
    setFormPencapaian(item.pencapaian.length ? [...item.pencapaian] : [""]);
    setEditTarget(item);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditTarget(null);
  };

  // ── Pencapaian list handlers ───────────────────────────────────────────────

  const updatePencapaian = (index: number, value: string) => {
    setFormPencapaian((prev) => prev.map((p, i) => (i === index ? value : p)));
  };

  const addPencapaian = () => setFormPencapaian((prev) => [...prev, ""]);

  const removePencapaian = (index: number) => {
    setFormPencapaian((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Save / Delete / Toggle ─────────────────────────────────────────────────

  const handleSave = async () => {
    const cleanPencapaian = formPencapaian.map((p) => p.trim()).filter(Boolean);
    if (!formNomor.trim() || !formNama.trim() || !formDeskripsi.trim()) {
      showToast("Nomor, nama usaha, dan deskripsi tidak boleh kosong.", "warning");
      return;
    }
    if (cleanPencapaian.length === 0) {
      showToast("Minimal satu pencapaian harus diisi.", "warning");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        nomor: formNomor.trim(),
        nama_usaha: formNama.trim(),
        deskripsi: formDeskripsi.trim(),
        pencapaian: cleanPencapaian,
      };
      if (modalMode === "add") {
        await api.post("/admin/studi-kasus", payload);
        showToast("Studi kasus berhasil ditambahkan.");
      } else if (editTarget) {
        await api.put(`/admin/studi-kasus/${editTarget.id}`, payload);
        showToast("Studi kasus berhasil diperbarui.");
      }
      closeModal();
      fetchItems();
    } catch {
      showToast("Gagal menyimpan studi kasus.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await api.delete(`/admin/studi-kasus/${deleteTarget.id}`);
      showToast("Studi kasus berhasil dihapus.");
      setDeleteTarget(null);
      fetchItems();
    } catch {
      showToast("Gagal menghapus studi kasus.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: StudiKasusItem) => {
    try {
      await api.put(`/admin/studi-kasus/${item.id}`, { is_active: !item.is_active });
      showToast(`Studi kasus ${!item.is_active ? "diaktifkan" : "dinonaktifkan"}.`);
      fetchItems();
    } catch {
      showToast("Gagal mengubah status.", "error");
    }
  };

  // ── Drag & Drop ────────────────────────────────────────────────────────────

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDragFromIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDrop = async (toIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (dragFromIndex === null || dragFromIndex === toIndex) {
      setDragFromIndex(null);
      return;
    }
    const reordered = [...items];
    const [moved] = reordered.splice(dragFromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setItems(reordered);
    setDragFromIndex(null);
    try {
      await api.post("/admin/studi-kasus/reorder", { ids: reordered.map((f) => f.id) });
      showToast("Urutan berhasil diperbarui.");
    } catch {
      showToast("Gagal menyimpan urutan baru.", "error");
      fetchItems();
    }
  };

  const handleDragEnd = () => {
    setDragFromIndex(null);
    setDragOverIndex(null);
  };

  // ── Filtered ───────────────────────────────────────────────────────────────

  const filtered = items.filter((f) => f.nama_usaha.toLowerCase().includes(searchQuery.toLowerCase()) || f.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));

  const activeCount = items.filter((f) => f.is_active).length;
  const inactiveCount = items.filter((f) => !f.is_active).length;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-semibold border transition-all animate-in slide-in-from-bottom-4 ${
            toast.type === "success"
              ? "bg-[#1a2e1a] border-green-500/30 text-green-400"
              : toast.type === "warning"
                ? "bg-[#2e2a1a] border-yellow-500/30 text-yellow-400"
                : "bg-[#2e1a1a] border-red-500/30 text-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          ) : toast.type === "warning" ? (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-white/[0.05] border border-white/10 text-[#b0a89e] text-xs font-semibold px-3 py-1.5 rounded-full">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            {items.length} total studi kasus
          </span>
          <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            {activeCount} aktif
          </span>
          {inactiveCount > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
              {inactiveCount} nonaktif
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#b0a89e]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari studi kasus..."
              className="pl-8 pr-4 py-2 text-xs bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-[#b0a89e]/40 focus:outline-none focus:border-[#e05c2a]/40 transition-colors w-48"
            />
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] hover:shadow-[0_4px_16px_rgba(224,92,42,0.35)] transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Studi Kasus
          </button>
        </div>
      </div>

      <p className="text-[#b0a89e]/40 text-xs flex items-center gap-1.5 -mt-2">
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
        </svg>
        Drag kartu untuk mengubah urutan tampil di halaman publik.
      </p>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-2 border-[#e05c2a] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#b0a89e]">Memuat data studi kasus...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-white/[0.06] rounded-2xl p-16 text-center bg-white/[0.01]">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
          </div>
          <p className="text-[#b0a89e] text-sm mb-1">{searchQuery ? `Tidak ditemukan untuk "${searchQuery}"` : "Belum ada studi kasus."}</p>
          {!searchQuery && (
            <>
              <p className="text-[#b0a89e]/50 text-xs mb-5">Tambahkan studi kasus pertama untuk ditampilkan di landing page.</p>
              <button onClick={openAdd} className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl bg-[#e05c2a] text-white hover:bg-[#f06b35] transition-all">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Studi Kasus Pertama
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOver(index)}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={(e) => handleDrop(index, e)}
              onDragEnd={handleDragEnd}
              className={`group relative border rounded-2xl p-4 flex items-start gap-4 transition-all cursor-grab active:cursor-grabbing active:scale-[0.99] active:shadow-2xl
                ${dragOverIndex === index && dragFromIndex !== index ? "border-[#e05c2a]/50 bg-[#e05c2a]/5 scale-[1.005]" : ""}
                ${dragFromIndex === index ? "opacity-40 scale-[0.98]" : ""}
                ${item.is_active ? "bg-[#2d2d2d] border-[#404040] hover:border-[#e05c2a]/40 hover:bg-[#333333]" : "bg-[#262626] border-[#383838] opacity-75"}`}
            >
              {/* Drag handle */}
              <div className="mt-1 text-[#b0a89e]/20 group-hover:text-[#b0a89e]/50 transition-colors shrink-0 pt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                </svg>
              </div>

              {/* Nomor badge */}
              <div className="shrink-0 w-8 h-8 rounded-lg bg-[#e05c2a] flex items-center justify-center text-white text-[10px] font-black mt-0.5">{item.nomor}</div>

              {/* Konten */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-sm text-white">{item.nama_usaha}</p>
                  {!item.is_active && <span className="text-[10px] font-bold bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full shrink-0">Nonaktif</span>}
                </div>
                <p className="text-xs text-[#b0a89e] leading-relaxed line-clamp-1 mb-1.5">{item.deskripsi}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.pencapaian.map((p, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-[#4caf50]/10 border border-[#4caf50]/20 text-[#81c784] text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0 mt-0.5">
                <button
                  onClick={() => handleToggleActive(item)}
                  title={item.is_active ? "Nonaktifkan" : "Aktifkan"}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                    item.is_active
                      ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                      : "bg-white/[0.04] border-white/10 text-[#b0a89e] hover:text-green-400 hover:border-green-500/30"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.is_active ? "M5 13l4 4L19 7" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
                  </svg>
                </button>
                <button
                  onClick={() => openEdit(item)}
                  title="Edit"
                  className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#b0a89e] hover:text-white hover:border-white/25 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  title="Hapus"
                  className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#b0a89e] hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && !loading && (
        <p className="text-[#b0a89e]/35 text-xs flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Hanya studi kasus berstatus aktif yang ditampilkan di halaman publik.
        </p>
      )}

      {/* ── MODAL ADD / EDIT ──────────────────────────────────────────────── */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#2a2a2a] border border-white/[0.09] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#e05c2a]/15 border border-[#e05c2a]/25 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#e05c2a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {modalMode === "add" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    )}
                  </svg>
                </div>
                <h2 className="font-semibold text-sm text-white">{modalMode === "add" ? "Tambah Studi Kasus" : "Edit Studi Kasus"}</h2>
              </div>
              <button onClick={closeModal} className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#b0a89e] hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="p-6 space-y-4 overflow-y-auto">
              {/* Nomor */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#b0a89e] mb-2">
                  Nomor <span className="text-[#e05c2a]">*</span>
                </label>
                <input
                  type="text"
                  value={formNomor}
                  onChange={(e) => setFormNomor(e.target.value)}
                  placeholder="Contoh: 01"
                  maxLength={10}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#b0a89e]/35 focus:outline-none focus:border-[#e05c2a]/50 transition-colors"
                />
              </div>

              {/* Nama Usaha */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#b0a89e] mb-2">
                  Nama Usaha <span className="text-[#e05c2a]">*</span>
                </label>
                <input
                  type="text"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Contoh: Koperasi Tani Agro Lestari"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#b0a89e]/35 focus:outline-none focus:border-[#e05c2a]/50 transition-colors"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#b0a89e] mb-2">
                  Deskripsi <span className="text-[#e05c2a]">*</span>
                </label>
                <textarea
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  rows={3}
                  placeholder="Ceritakan konteks usaha dan apa yang mereka lakukan..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-[#b0a89e]/35 focus:outline-none focus:border-[#e05c2a]/50 resize-none transition-colors leading-relaxed"
                />
              </div>

              {/* Pencapaian */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#b0a89e] mb-2">
                  Pencapaian <span className="text-[#e05c2a]">*</span>
                  <span className="normal-case font-normal tracking-normal ml-1 text-[#b0a89e]/50">(min. 1)</span>
                </label>
                <div className="space-y-2">
                  {formPencapaian.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[#4caf50] text-sm font-bold shrink-0">✓</span>
                      <input
                        type="text"
                        value={p}
                        onChange={(e) => updatePencapaian(i, e.target.value)}
                        placeholder={`Pencapaian ${i + 1}...`}
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#b0a89e]/35 focus:outline-none focus:border-[#e05c2a]/50 transition-colors"
                      />
                      {formPencapaian.length > 1 && (
                        <button
                          onClick={() => removePencapaian(i)}
                          className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all shrink-0"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addPencapaian}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-bold text-[#b0a89e] hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Pencapaian
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 px-6 pb-5 pt-2 shrink-0 border-t border-white/[0.07]">
              <button onClick={closeModal} className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-[#b0a89e] text-xs font-semibold hover:border-white/20 hover:text-white transition-all">
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e05c2a] text-white text-xs font-bold hover:bg-[#f06b35] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {saving ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {saving ? "Menyimpan..." : modalMode === "add" ? "Simpan" : "Perbarui"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DELETE ──────────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#2a2a2a] border border-white/[0.09] rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-base text-white mb-1.5">Hapus Studi Kasus?</h3>
            <p className="text-xs text-[#b0a89e] mb-3">Studi kasus berikut akan dihapus secara permanen:</p>
            <p className="text-sm text-white font-medium mb-6 px-2 bg-white/[0.03] border border-white/[0.06] rounded-xl py-3 leading-relaxed">"{deleteTarget.nama_usaha}"</p>
            <div className="flex gap-2.5 justify-center">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.08] text-[#b0a89e] text-xs font-semibold hover:border-white/20 hover:text-white transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 disabled:opacity-50 transition-all"
              >
                {saving ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
