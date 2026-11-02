import type { Esquemas } from "@/lib/api/tipos";

export type Medio = Esquemas["Medio"];
export type MedioDetalle = Esquemas["MedioDetalle"];
export type TipoMedio = Esquemas["TipoMedio"];
export type FiltrosMedios = { tipo?: TipoMedio; buscar?: string; pagina?: number };

/** 1536000 → "1,5 MB" */
export function formatearPeso(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString("es-CR", { maximumFractionDigits: 1 })} MB`;
}
