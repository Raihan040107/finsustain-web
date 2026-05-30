export type Pertanyaan = {
  pertanyaan_id: number;
  pertanyaan: string;
  aspek?: "environment" | "social" | "governance";
  urutan?: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  id_role: number;
  created_at: string | null;
};

export type AdminUsaha = {
  id_usaha: number;
  user_id: number;
  nama_usaha: string;
  bidang_usaha: string;
  alamat: string;
  nama_user: string;
  email_user: string;
  status_verifikasi: "menunggu" | "terverifikasi" | "ditolak" | string;
  tanggal_registrasi: string | null;
  tanggal_verifikasi: string | null;
  ktp?: string | null;
  npwp?: string | null;
  surat_izin_usaha?: string | null;
  skor_total?: number | string | null;
  kategori_skor?: string | null;
  tanggal_perhitungan?: string | null;
};

export type NavItem = {
  key: string;
  label: string;
  icon: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};
