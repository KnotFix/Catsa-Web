"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { apiPanel, intentar } from "@/features/auth/server/panel";
import type { Resultado } from "@/lib/api/resultado";
import type { DatosUsuario, Invitacion, UsuarioPanel } from "./types";

// Django decide permisos (módulo Administración) y protege que un administrador
// no se quite el acceso a sí mismo.

const BASE = "/api/panel/usuarios";

export async function invitarUsuario(datos: Invitacion): Promise<Resultado<UsuarioPanel>> {
  const resultado = await intentar(() => apiPanel<UsuarioPanel>(`${BASE}/`, { method: "POST", body: datos }));
  if (!resultado.ok) return resultado;
  redirect(`/admin/usuarios/${resultado.datos.id}?invitado=1`);
}

export async function guardarUsuario(id: number, datos: DatosUsuario) {
  const resultado = await intentar(() =>
    apiPanel<UsuarioPanel>(`${BASE}/${id}/`, { method: "PATCH", body: datos }),
  );
  if (resultado.ok) refresh();
  return resultado;
}

type Accion = "desactivar" | "activar" | "restablecer-2fa" | "reenviar-invitacion";

export async function accionUsuario(id: number, accion: Accion) {
  const resultado = await intentar(() =>
    apiPanel<UsuarioPanel>(`${BASE}/${id}/${accion}/`, { method: "POST" }),
  );
  if (resultado.ok) refresh();
  return resultado;
}
