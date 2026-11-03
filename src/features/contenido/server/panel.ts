import "server-only";
import { apiPanel } from "@/features/auth/server/panel";
import type { AjustesPanel, EspacioPanel } from "../types";

export function listarEspacios() {
  return apiPanel<EspacioPanel[]>("/api/panel/contenido/espacios/");
}

export function obtenerEspacioPanel(clave: string) {
  return apiPanel<EspacioPanel>(`/api/panel/contenido/espacios/${encodeURIComponent(clave)}/`);
}

export function obtenerAjustesPanel() {
  return apiPanel<AjustesPanel>("/api/panel/contenido/ajustes/");
}
