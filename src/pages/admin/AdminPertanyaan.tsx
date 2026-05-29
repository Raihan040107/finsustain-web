import { useState, useEffect, useCallback } from "react";
import api from "../../lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────

type Aspek = "environment" | "social" | "governance";

interface OpsiJawaban {
  opsi_id: number;
  label: string;
  teks: string;
  nilai: number;
}

interface Pertanyaan {
  pertanyaan_id: number;
  pertanyaan: string;
  aspek: Aspek;
  urutan: number;
  opsi_jawaban: OpsiJawaban[];
}

// ── Konstanta ─────────────────────────────────────────────────────────────────

const ASPEK_LABEL: Record<Aspek, string> = {
  environment: "🌿 Lingkungan",
  social: "🤝 Sosial",
  governance: "🏢 Tata Kelola",
};

const ASPEK_COLOR: Record<Aspek, string> = {
  environment: "bg-green-500/10 text-green-400 border-green-500/20",
  social: "bg-blue-500/10  text-blue-400  border-blue-500/20",
  governance: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const NILAI_LABEL: Record<number, string> = {
  1: "Rendah",
  2: "Sedang",
  3: "Tinggi",
};

const EMPTY_OPSI = (): OpsiJawaban[] => [
  { opsi_id: 0, label: "A", teks: "", nilai: 1 },
  { opsi_id: 0, label: "B", teks: "", nilai: 2 },
  { opsi_id: 0, label: "C", teks: "", nilai: 3 },
];

// ── Komponen ──────────────────────────────────────────────────────────────────

export default function AdminPertanyaan() {
  const [pertanyaan, setPertanyaan] = useState<Pertanyaan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; ok: boolean } | null>(null);

  // Modal state
  const [modal, setModal] = useState<{
    mode: "add" | "edit";
    data: Partial<Pertanyaan> & { opsi: OpsiJawaban[] };
  } | null>(null);

  // Konfirmasi hapus
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Filter aspek aktif
  const [filterAspek, setFilterAspek] = useState<Aspek | "all">("all");

  // ── Fetch ────────────────────────────────────────────────────────────────────

  const fetchPertanyaan = useCallback(async () => {
    try {
      setIsLoading(true);
      // const res = await api.get<{ data: Pertanyaan[] }>("/pertanyaan");
      // setPertanyaan(res.data.data);
      const res = await api.get<{ data: Pertanyaan[] }>("/pertanyaan");

      const normalized = res.data.data.map((item) => ({
        ...item,
        opsi_jawaban: item.opsi_jawaban ?? [],
      }));

      setPertanyaan(normalized);
    } catch {
      showNotif("Gagal memuat data pertanyaan.", false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPertanyaan();
  }, [fetchPertanyaan]);

  // ── Helper notif ──────────────────────────────────────────────────────────────

  function showNotif(msg: string, ok: boolean) {
    setNotification({ msg, ok });
    setTimeout(() => setNotification(null), 3000);
  }

  // ── Modal helpers ─────────────────────────────────────────────────────────────

  function openAdd() {
    setModal({
      mode: "add",
      data: {
        pertanyaan: "",
        aspek: "environment",
        urutan: 1,
        opsi: EMPTY_OPSI(),
      },
    });
  }

  function openEdit(p: Pertanyaan) {
    setModal({
      mode: "edit",
      data: {
        pertanyaan_id: p.pertanyaan_id,
        pertanyaan: p.pertanyaan,
        aspek: p.aspek,
        urutan: p.urutan,
        opsi: p.opsi_jawaban.length > 0 ? p.opsi_jawaban.map((o) => ({ ...o })) : EMPTY_OPSI(),
      },
    });
  }

  function closeModal() {
    setModal(null);
  }

  function updateModalField<K extends keyof Pertanyaan>(key: K, value: Pertanyaan[K]) {
    setModal((prev) => (prev ? { ...prev, data: { ...prev.data, [key]: value } } : null));
  }

  function updateOpsi(idx: number, field: keyof OpsiJawaban, value: string | number) {
    setModal((prev) => {
      if (!prev) return null;
      const opsi = prev.data.opsi.map((o, i) => (i === idx ? { ...o, [field]: value } : o));
      return { ...prev, data: { ...prev.data, opsi } };
    });
  }

  function addOpsiRow() {
    setModal((prev) => {
      if (!prev) return null;
      const nextLabel = String.fromCharCode(65 + prev.data.opsi.length); // A,B,C,D...
      return {
        ...prev,
        data: {
          ...prev.data,
          opsi: [...prev.data.opsi, { opsi_id: 0, label: nextLabel, teks: "", nilai: 1 }],
        },
      };
    });
  }

  function removeOpsiRow(idx: number) {
    setModal((prev) => {
      if (!prev) return null;
      const opsi = prev.data.opsi.filter((_, i) => i !== idx);
      return { ...prev, data: { ...prev.data, opsi } };
    });
  }

  // ── Submit modal ──────────────────────────────────────────────────────────────

  async function handleSave() {
    if (!modal) return;
    const { mode, data } = modal;

    // Validasi sederhana
    if (!data.pertanyaan?.trim()) {
      showNotif("Teks pertanyaan tidak boleh kosong.", false);
      return;
    }
    if (data.opsi.some((o) => !o.teks.trim() || !o.label.trim())) {
      showNotif("Semua opsi harus memiliki label dan teks.", false);
      return;
    }

    try {
      setIsSaving(true);

      if (mode === "add") {
        // POST /pertanyaan (langsung kirim dengan opsi)
        await api.post("/pertanyaan", {
          pertanyaan: data.pertanyaan,
          aspek: data.aspek,
          urutan: data.urutan,
          opsi: data.opsi.map(({ label, teks, nilai }) => ({ label, teks, nilai })),
        });
        showNotif("Pertanyaan berhasil ditambahkan.", true);
      } else {
        const id = data.pertanyaan_id!;

        // Update field pertanyaan
        await api.put(`/pertanyaan/${id}`, {
          pertanyaan: data.pertanyaan,
          aspek: data.aspek,
          urutan: data.urutan,
        });

        // Sync semua opsi sekaligus
        await api.put(`/pertanyaan/${id}/opsi/sync`, {
          opsi: data.opsi.map(({ label, teks, nilai }) => ({ label, teks, nilai })),
        });

        showNotif("Pertanyaan berhasil diperbarui.", true);
      }

      closeModal();
      await fetchPertanyaan();
    } catch {
      showNotif("Gagal menyimpan. Cek kembali data Anda.", false);
    } finally {
      setIsSaving(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────────

  async function handleDelete(id: number) {
    try {
      await api.delete(`/pertanyaan/${id}`);
      showNotif("Pertanyaan berhasil dihapus.", true);
      setConfirmDelete(null);
      await fetchPertanyaan();
    } catch {
      showNotif("Gagal menghapus pertanyaan.", false);
    }
  }

  // ── Filter ────────────────────────────────────────────────────────────────────

  const filtered = filterAspek === "all" ? pertanyaan : pertanyaan.filter((p) => p.aspek === filterAspek);

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8 text-ftech-dark">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Notifikasi */}
        {notification && (
          <div
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all ${
              notification.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            <span>{notification.ok ? "✓" : "✕"}</span>
            {notification.msg}
          </div>
        )}

        {/* Header */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-ftech-dark via-ftech-medium to-ftech-dark p-6 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-ftech-orange/10 rounded-full blur-3xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-ftech-orange">Admin Panel</p>
              <h1 className="mt-1 text-2xl font-bold">Manajemen Pertanyaan ESG</h1>
              <p className="mt-1 text-sm text-white/60">{pertanyaan.length} pertanyaan terdaftar</p>
            </div>
            <button onClick={openAdd} className="flex items-center gap-2 rounded-xl bg-[#e05c2a] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#f06b35] transition-all shadow-md">
              + Tambah Soal
            </button>
          </div>
        </header>

        {/* Filter aspek */}
        <div className="flex flex-wrap gap-2">
          {(["all", "environment", "social", "governance"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setFilterAspek(a)}
              className={`rounded-xl px-4 py-2 text-xs font-bold border transition-all ${
                filterAspek === a ? "bg-[#e05c2a] text-white border-[#e05c2a]" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {a === "all" ? "Semua Aspek" : ASPEK_LABEL[a]}
            </button>
          ))}
        </div>

        {/* Tabel / List */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-ftech-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-400 text-sm">Belum ada pertanyaan. Klik "+ Tambah Soal".</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <div key={p.pertanyaan_id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Badge aspek + urutan */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${ASPEK_COLOR[p.aspek]}`}>{ASPEK_LABEL[p.aspek]}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-slate-100 text-slate-500 border-slate-200">Urutan #{p.urutan}</span>
                    </div>

                    {/* Teks pertanyaan */}
                    <p className="text-sm font-semibold text-slate-800 leading-snug">{p.pertanyaan}</p>

                    {/* Opsi preview */}
                    {p.opsi_jawaban.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {p.opsi_jawaban.map((o) => (
                          <div key={o.opsi_id} className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 shrink-0">{o.label}</span>
                            <span className="flex-1 truncate">{o.teks}</span>
                            <span
                              className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                o.nilai === 3 ? "bg-green-100 text-green-700" : o.nilai === 2 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                              }`}
                            >
                              {NILAI_LABEL[o.nilai]}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tombol aksi */}
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => openEdit(p)} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(p.pertanyaan_id)}
                      className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal Tambah / Edit ──────────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold">{modal.mode === "add" ? "Tambah Pertanyaan Baru" : "Edit Pertanyaan"}</h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Teks pertanyaan */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Teks Pertanyaan</label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-ftech-orange focus:ring-2 focus:ring-ftech-orange/20 resize-none"
                  rows={3}
                  value={modal.data.pertanyaan ?? ""}
                  onChange={(e) => updateModalField("pertanyaan", e.target.value)}
                  placeholder="Tulis pertanyaan ESG di sini..."
                />
              </div>

              {/* Aspek + Urutan */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Aspek</label>
                  <select
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-ftech-orange"
                    value={modal.data.aspek ?? "environment"}
                    onChange={(e) => updateModalField("aspek", e.target.value as Aspek)}
                  >
                    <option value="environment">🌿 Lingkungan</option>
                    <option value="social">🤝 Sosial</option>
                    <option value="governance">🏢 Tata Kelola</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Urutan di Aspek</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-ftech-orange"
                    value={modal.data.urutan ?? 1}
                    onChange={(e) => updateModalField("urutan", Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Opsi jawaban */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Opsi Jawaban</label>
                  {modal.data.opsi.length < 5 && (
                    <button type="button" onClick={addOpsiRow} className="text-xs font-bold text-ftech-orange hover:underline">
                      + Tambah Opsi
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {modal.data.opsi.map((opsi, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                      {/* Label */}
                      <input
                        className="w-10 text-center rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm font-bold outline-none focus:border-ftech-orange uppercase"
                        maxLength={1}
                        value={opsi.label}
                        onChange={(e) => updateOpsi(idx, "label", e.target.value.toUpperCase())}
                      />

                      {/* Teks */}
                      <input
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-ftech-orange"
                        placeholder="Teks opsi jawaban..."
                        value={opsi.teks}
                        onChange={(e) => updateOpsi(idx, "teks", e.target.value)}
                      />

                      {/* Nilai skor */}
                      <select
                        className="w-28 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-bold outline-none focus:border-ftech-orange"
                        value={opsi.nilai}
                        onChange={(e) => updateOpsi(idx, "nilai", Number(e.target.value))}
                      >
                        <option value={1}>1 – Rendah</option>
                        <option value={2}>2 – Sedang</option>
                        <option value={3}>3 – Tinggi</option>
                      </select>

                      {/* Hapus baris opsi */}
                      {modal.data.opsi.length > 1 && (
                        <button type="button" onClick={() => removeOpsiRow(idx)} className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-all shrink-0">
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <p className="mt-2 text-[11px] text-slate-400">Nilai 1 = rendah (skor ESG buruk), 2 = sedang, 3 = tinggi (skor ESG baik).</p>
              </div>
            </div>

            {/* Footer modal */}
            <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={closeModal} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-xl bg-[#e05c2a] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#f06b35] disabled:opacity-60 transition-all shadow-md"
              >
                {isSaving ? "Menyimpan..." : modal.mode === "add" ? "Tambah Pertanyaan" : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal konfirmasi hapus ───────────────────────────────────────────── */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setConfirmDelete(null)}>
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-7 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🗑️</span>
            </div>
            <h3 className="text-base font-bold text-slate-800">Hapus pertanyaan ini?</h3>
            <p className="mt-2 text-sm text-slate-500">Semua opsi jawaban juga akan ikut terhapus dan tidak dapat dikembalikan.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                Batal
              </button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-500 transition-all">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
