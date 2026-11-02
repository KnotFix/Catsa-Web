import "server-only";
import { apiPanel } from "@/features/auth/server/panel";
import type { Pagina } from "@/lib/api/tipos";
import type { AreaPanel, EstadoPuesto, Puesto, PuestoDetallePanel, PuestoPanel } from "../types";

// Lecturas del panel: por usuario y siempre frescas (sin "use cache").

export function listarPuestosPanel({
  estado,
  buscar,
  pagina = 1,
}: { estado?: EstadoPuesto; buscar?: string; pagina?: number } = {}) {
  const consulta = new URLSearchParams({
    page: String(pagina),
    ...(estado && { estado }),
    ...(buscar && { buscar }),
  });
  return apiPanel<Pagina<PuestoPanel>>(`/api/panel/puestos/?${consulta}`);
}

export function obtenerPuestoPanel(id: number) {
  return apiPanel<PuestoDetallePanel>(`/api/panel/puestos/${id}/`);
}

export function vistaPreviaPuesto(id: number) {
  return apiPanel<Puesto>(`/api/panel/puestos/${id}/vista-previa/`);
}

export function listarAreasPanel() {
  return apiPanel<AreaPanel[]>("/api/panel/puestos/areas/");
}

/** Ubicaciones ya usadas, para sugerirlas al escribir y no tener "Filadelfia" y "filadelfia". */
export async function ubicacionesUsadas() {
  const { results } = await apiPanel<Pagina<PuestoPanel>>("/api/panel/puestos/?por_pagina=100");
  return [...new Set(results.map((p) => p.ubicacion))].sort((a, b) => a.localeCompare(b, "es"));
}
