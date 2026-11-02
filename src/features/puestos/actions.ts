"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { apiPanel, intentar } from "@/features/auth/server/panel";
import type { Resultado } from "@/lib/api/resultado";
import type { AreaPanel, PuestoDetallePanel, PuestoEntrada } from "./types";

// Django valida todo y decide permisos (módulo Puestos). Al abrir, cerrar o
// editar algo visible, él mismo avisa a este sitio qué páginas refrescar.

const BASE = "/api/panel/puestos";

export async function crearPuesto(datos: PuestoEntrada): Promise<Resultado<PuestoDetallePanel>> {
  const resultado = await intentar(() =>
    apiPanel<PuestoDetallePanel>(`${BASE}/`, { method: "POST", body: datos }),
  );
  if (!resultado.ok) return resultado;
  redirect(`/admin/puestos/${resultado.datos.id}`);
}

export async function guardarPuesto(id: number, datos: PuestoEntrada) {
  return intentar(() => apiPanel<PuestoDetallePanel>(`${BASE}/${id}/`, { method: "PATCH", body: datos }));
}

async function transicion(id: number, accion: "abrir" | "cerrar") {
  const resultado = await intentar(() =>
    apiPanel<PuestoDetallePanel>(`${BASE}/${id}/${accion}/`, { method: "POST" }),
  );
  if (resultado.ok) refresh();
  return resultado;
}

export async function abrirPuesto(id: number) {
  return transicion(id, "abrir");
}

export async function cerrarPuesto(id: number) {
  return transicion(id, "cerrar");
}

export async function eliminarPuesto(id: number): Promise<Resultado> {
  const resultado = await intentar(() => apiPanel<null>(`${BASE}/${id}/`, { method: "DELETE" }));
  if (!resultado.ok) return resultado;
  redirect("/admin/puestos");
}

// --- Áreas ------------------------------------------------------------------

type AreaEntrada = Pick<AreaPanel, "nombre" | "color" | "orden">;

export async function guardarArea(id: number | null, datos: Partial<AreaEntrada>) {
  const resultado = await intentar(() =>
    id === null
      ? apiPanel<AreaPanel>(`${BASE}/areas/`, { method: "POST", body: datos })
      : apiPanel<AreaPanel>(`${BASE}/areas/${id}/`, { method: "PATCH", body: datos }),
  );
  if (resultado.ok) refresh();
  return resultado;
}

export async function eliminarArea(id: number): Promise<Resultado> {
  const resultado = await intentar(() => apiPanel<null>(`${BASE}/areas/${id}/`, { method: "DELETE" }));
  if (!resultado.ok) return resultado;
  refresh();
  return { ok: true, datos: undefined };
}
