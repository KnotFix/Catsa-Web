"use server";

import { refresh } from "next/cache";
import { apiPanel, intentar } from "@/features/auth/server/panel";
import type { Resultado } from "@/lib/api/resultado";
import type { Pagina } from "@/lib/api/tipos";
import { listarMedios, obtenerMedio } from "./server/api";
import type { FiltrosMedios, Medio, MedioDetalle } from "./types";

// Los permisos los decide Django: ver (cualquier usuario del panel), subir y
// editar (Biblioteca), eliminar (Administración).

export async function subirMedio(datos: FormData): Promise<Resultado<Medio>> {
  const archivo = datos.get("archivo");
  if (!(archivo instanceof File) || archivo.size === 0) return { ok: false, error: "Elija un archivo." };

  const envio = new FormData();
  envio.set("archivo", archivo);
  envio.set("alt", String(datos.get("alt") ?? ""));
  const resultado = await intentar(() =>
    apiPanel<Medio>("/api/panel/medios/", { method: "POST", body: envio }),
  );
  if (resultado.ok) refresh();
  return resultado;
}

export async function actualizarMedio(
  id: number,
  cambios: { alt?: string; nombre?: string },
): Promise<Resultado<MedioDetalle>> {
  const resultado = await intentar(() =>
    apiPanel<MedioDetalle>(`/api/panel/medios/${id}/`, { method: "PATCH", body: cambios }),
  );
  if (resultado.ok) refresh();
  return resultado;
}

export async function eliminarMedio(id: number): Promise<Resultado> {
  const resultado = await intentar(() => apiPanel<null>(`/api/panel/medios/${id}/`, { method: "DELETE" }));
  if (resultado.ok) refresh();
  return resultado.ok ? { ok: true, datos: undefined } : resultado;
}

/** Para el selector de archivos de los formularios. */
export async function buscarMedios(filtros: FiltrosMedios): Promise<Resultado<Pagina<Medio>>> {
  return intentar(() => listarMedios(filtros));
}

export async function verMedio(id: number): Promise<Resultado<MedioDetalle>> {
  return intentar(() => obtenerMedio(id));
}
