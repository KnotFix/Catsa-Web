import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { ApiError } from "@/lib/api/errores";
import { etiquetas } from "@/lib/api/etiquetas";
import { apiFetch } from "@/lib/api/http";
import { conRespaldo } from "@/lib/api/respaldo";
import { paginaVacia, type Pagina } from "@/lib/api/tipos";
import type { FiltrosElegidos, FiltrosPuestos, Puesto, PuestoResumen } from "./types";

// Un puesto sale solo del listado cuando vence su fecha de cierre, sin que
// Django avise. Por eso la caché dura minutos y no horas.

export async function listarPuestos({ area, ubicacion }: FiltrosElegidos = {}): Promise<
  Pagina<PuestoResumen>
> {
  "use cache";
  cacheTag(etiquetas.puestos);
  cacheLife("minutes");
  const consulta = new URLSearchParams({
    por_pagina: "100",
    ...(area && { area }),
    ...(ubicacion && { ubicacion }),
  });
  return conRespaldo(
    () => apiFetch<Pagina<PuestoResumen>>(`/api/puestos/?${consulta}`),
    paginaVacia<PuestoResumen>(),
  );
}

export async function obtenerFiltros(): Promise<FiltrosPuestos> {
  "use cache";
  cacheTag(etiquetas.puestos);
  cacheLife("minutes");
  return conRespaldo(() => apiFetch<FiltrosPuestos>("/api/puestos/filtros/"), { areas: [], ubicaciones: [] });
}

export async function obtenerPuesto(slug: string): Promise<Puesto | null> {
  "use cache";
  cacheTag(etiquetas.puestos, etiquetas.puesto(slug));
  cacheLife("minutes");
  try {
    return await apiFetch<Puesto>(`/api/puestos/${encodeURIComponent(slug)}/`);
  } catch (error) {
    if (error instanceof ApiError && error.noEncontrado) return null;
    throw error;
  }
}
