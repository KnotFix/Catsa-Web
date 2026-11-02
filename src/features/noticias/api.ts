import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { ApiError } from "@/lib/api/errores";
import { etiquetas } from "@/lib/api/etiquetas";
import { apiFetch } from "@/lib/api/http";
import { conRespaldo } from "@/lib/api/respaldo";
import { paginaVacia, type Pagina } from "@/lib/api/tipos";
import type { Noticia, NoticiaResumen } from "./types";

// Lecturas públicas: en caché hasta que Django avise que algo cambió
// (POST /api/revalidar con la etiqueta). cacheLife es solo la red de seguridad.

export async function listarNoticias(pagina = 1): Promise<Pagina<NoticiaResumen>> {
  "use cache";
  cacheTag(etiquetas.noticias);
  cacheLife("hours");
  return conRespaldo(
    () => apiFetch<Pagina<NoticiaResumen>>(`/api/noticias/?page=${pagina}`),
    paginaVacia<NoticiaResumen>(),
  );
}

export async function obtenerNoticia(slug: string): Promise<Noticia | null> {
  "use cache";
  cacheTag(etiquetas.noticias, etiquetas.noticia(slug));
  cacheLife("hours");
  try {
    return await apiFetch<Noticia>(`/api/noticias/${encodeURIComponent(slug)}/`);
  } catch (error) {
    if (error instanceof ApiError && error.noEncontrado) return null;
    throw error;
  }
}
