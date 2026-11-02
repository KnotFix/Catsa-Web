import "server-only";
import { apiPanel } from "@/features/auth/server/panel";
import type { Pagina } from "@/lib/api/tipos";
import type { FiltrosMedios, Medio, MedioDetalle } from "../types";

export function listarMedios({ tipo, buscar, pagina = 1 }: FiltrosMedios = {}) {
  const consulta = new URLSearchParams({
    page: String(pagina),
    por_pagina: "24",
    ...(tipo && { tipo }),
    ...(buscar && { buscar }),
  });
  return apiPanel<Pagina<Medio>>(`/api/panel/medios/?${consulta}`);
}

export function obtenerMedio(id: number) {
  return apiPanel<MedioDetalle>(`/api/panel/medios/${id}/`);
}
