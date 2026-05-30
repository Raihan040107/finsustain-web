import api from "./api";

export interface OpsiJawaban {
  opsi_id: number;
  label: string;
  teks: string;
  nilai: number;
}

export interface Pertanyaan {
  pertanyaan_id: number;
  pertanyaan: string;
  aspek: "environment" | "social" | "governance";
  urutan: number;
  opsi_jawaban: OpsiJawaban[];
}

let pertanyaanCache: Pertanyaan[] | null = null;
let pertanyaanRequest: Promise<Pertanyaan[]> | null = null;

export function invalidatePertanyaanCache() {
  pertanyaanCache = null;
  pertanyaanRequest = null;
}

export async function getPertanyaan(force = false): Promise<Pertanyaan[]> {
  if (!force && pertanyaanCache) return pertanyaanCache;
  if (!force && pertanyaanRequest) return pertanyaanRequest;

  pertanyaanRequest = api
    .get<{ data: Pertanyaan[] }>("/pertanyaan")
    .then((res) => {
      pertanyaanCache = res.data.data.map((item) => ({
        ...item,
        opsi_jawaban: item.opsi_jawaban ?? [],
      }));

      return pertanyaanCache;
    })
    .finally(() => {
      pertanyaanRequest = null;
    });

  return pertanyaanRequest;
}
