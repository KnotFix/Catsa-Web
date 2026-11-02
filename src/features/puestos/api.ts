import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { ApiError } from "@/lib/api/errores";
import { etiquetas } from "@/lib/api/etiquetas";
import { apiFetch } from "@/lib/api/http";
import { conRespaldo } from "@/lib/api/respaldo";
import { paginaVacia, type Pagina } from "@/lib/api/tipos";
import type { Puesto, PuestoResumen } from "./types";

export async function listarPuestos(): Promise<Pagina<PuestoResumen>> {
  "use cache";
  cacheTag(etiquetas.puestos);
  cacheLife("hours");
  return conRespaldo(() => apiFetch<Pagina<PuestoResumen>>("/api/puestos/"), paginaVacia<PuestoResumen>());
}

export async function obtenerPuesto(slug: string): Promise<Puesto | null> {
  "use cache";
  cacheTag(etiquetas.puestos, etiquetas.puesto(slug));
  cacheLife("hours");
  try {
    return await apiFetch<Puesto>(`/api/puestos/${encodeURIComponent(slug)}/`);
  } catch (error) {
    if (error instanceof ApiError && error.noEncontrado) return null;
    throw error;
  }
}
