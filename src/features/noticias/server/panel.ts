import "server-only";
import { apiPanel } from "@/features/auth/server/panel";
import type { Pagina } from "@/lib/api/tipos";
import type { CategoriaPanel, EstadoNoticia, Noticia, NoticiaDetallePanel, NoticiaPanel } from "../types";

// Lecturas del panel: por usuario y siempre frescas (sin "use cache").

export function listarNoticiasPanel({
  estado,
  buscar,
  pagina = 1,
}: { estado?: EstadoNoticia; buscar?: string; pagina?: number } = {}) {
  const consulta = new URLSearchParams({
    page: String(pagina),
    ...(estado && { estado }),
    ...(buscar && { buscar }),
  });
  return apiPanel<Pagina<NoticiaPanel>>(`/api/panel/noticias/?${consulta}`);
}

export function obtenerNoticiaPanel(id: number) {
  return apiPanel<NoticiaDetallePanel>(`/api/panel/noticias/${id}/`);
}

/** La noticia con la misma forma que en el sitio, en cualquier estado. */
export function vistaPreviaNoticia(id: number) {
  return apiPanel<Noticia>(`/api/panel/noticias/${id}/vista-previa/`);
}

export function listarCategoriasPanel() {
  return apiPanel<CategoriaPanel[]>("/api/panel/noticias/categorias/");
}
