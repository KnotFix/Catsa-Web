import "server-only";
import { apiPanel } from "@/features/auth/server/panel";
import type { Pagina } from "@/lib/api/tipos";
import type { Acceso, EventoAcceso, UsuarioPanel } from "../types";

export function listarUsuarios({ buscar, pagina = 1 }: { buscar?: string; pagina?: number } = {}) {
  const consulta = new URLSearchParams({ page: String(pagina), por_pagina: "50", ...(buscar && { buscar }) });
  return apiPanel<Pagina<UsuarioPanel>>(`/api/panel/usuarios/?${consulta}`);
}

export function obtenerUsuarioPanel(id: number) {
  return apiPanel<UsuarioPanel>(`/api/panel/usuarios/${id}/`);
}

export function listarAccesos({
  evento,
  buscar,
  pagina = 1,
}: { evento?: EventoAcceso; buscar?: string; pagina?: number } = {}) {
  const consulta = new URLSearchParams({
    page: String(pagina),
    por_pagina: "50",
    ...(evento && { evento }),
    ...(buscar && { buscar }),
  });
  return apiPanel<Pagina<Acceso>>(`/api/panel/accesos/?${consulta}`);
}
