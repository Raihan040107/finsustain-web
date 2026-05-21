export type Pertanyaan = {
  pertanyaan_id: number;
  pertanyaan: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  id_role: number;
  created_at: string;
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
