"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { apiPanel, intentar } from "@/features/auth/server/panel";
import type { Resultado } from "@/lib/api/resultado";
import type { CategoriaPanel, NoticiaDetallePanel, NoticiaEntrada } from "./types";

// Django valida todo y decide permisos (módulo Noticias). Al publicar o editar
// algo visible, él mismo avisa a este sitio qué páginas refrescar.

const BASE = "/api/panel/noticias";

export async function crearNoticia(_: Resultado<never> | undefined, datos: FormData) {
  const titulo = String(datos.get("titulo") ?? "").trim();
  if (!titulo)
    return { ok: false, error: "Escriba un título.", campos: { titulo: "Escriba un título." } } as const;

  const resultado = await intentar(() =>
    apiPanel<NoticiaDetallePanel>(`${BASE}/`, { method: "POST", body: { titulo } }),
  );
  if (!resultado.ok) return resultado;
  redirect(`/admin/noticias/${resultado.datos.id}`);
}

export async function guardarNoticia(id: number, datos: NoticiaEntrada) {
  return intentar(() => apiPanel<NoticiaDetallePanel>(`${BASE}/${id}/`, { method: "PATCH", body: datos }));
}

async function transicion(id: number, accion: "publicar" | "archivar") {
  const resultado = await intentar(() =>
    apiPanel<NoticiaDetallePanel>(`${BASE}/${id}/${accion}/`, { method: "POST" }),
  );
  if (resultado.ok) refresh();
  return resultado;
}

export async function publicarNoticia(id: number) {
  return transicion(id, "publicar");
}

export async function archivarNoticia(id: number) {
  return transicion(id, "archivar");
}

export async function eliminarNoticia(id: number): Promise<Resultado> {
  const resultado = await intentar(() => apiPanel<null>(`${BASE}/${id}/`, { method: "DELETE" }));
  if (!resultado.ok) return resultado;
  redirect("/admin/noticias");
}

// --- Categorías -------------------------------------------------------------

type CategoriaEntrada = Pick<CategoriaPanel, "nombre" | "color" | "descripcion" | "visible" | "orden">;

export async function guardarCategoria(id: number | null, datos: Partial<CategoriaEntrada>) {
  const resultado = await intentar(() =>
    id === null
      ? apiPanel<CategoriaPanel>(`${BASE}/categorias/`, { method: "POST", body: datos })
      : apiPanel<CategoriaPanel>(`${BASE}/categorias/${id}/`, { method: "PATCH", body: datos }),
  );
  if (resultado.ok) refresh();
  return resultado;
}

export async function eliminarCategoria(id: number): Promise<Resultado> {
  const resultado = await intentar(() => apiPanel<null>(`${BASE}/categorias/${id}/`, { method: "DELETE" }));
  if (!resultado.ok) return resultado;
  refresh();
  return { ok: true, datos: undefined };
}
