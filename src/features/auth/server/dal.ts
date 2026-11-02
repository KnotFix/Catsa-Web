import "server-only";
import { redirect } from "next/navigation";
import type { Modulo } from "@/config/modulos";
import { ApiError } from "@/lib/api/errores";
import { apiFetch } from "@/lib/api/http";
import type { Usuario } from "../types";
import { leerTokenSesion } from "./cookies";

/**
 * Capa de acceso a datos de la sesión. Es la única forma válida de saber
 * quién es el usuario: el proxy solo mira si existe la cookie, aquí se valida
 * contra Django en cada petición.
 */
export async function obtenerUsuario(): Promise<Usuario> {
  "use cache: private";
  const token = await leerTokenSesion();
  if (!token) redirect("/admin/login");

  try {
    return await apiFetch<Usuario>("/api/cuentas/yo/", { token });
  } catch (error) {
    if (error instanceof ApiError && (error.noAutorizado || error.status === 403)) {
      redirect("/admin/login");
    }
    throw error;
  }
}

/** Para páginas de un módulo: sin permiso, de vuelta al inicio del panel. */
export async function exigirModulo(modulo: Modulo): Promise<Usuario> {
  const usuario = await obtenerUsuario();
  if (!usuario.modulos.includes(modulo)) redirect("/admin");
  return usuario;
}

/** Token para que las acciones del panel llamen a la API en nombre del usuario. */
export async function tokenParaApi(): Promise<string> {
  const token = await leerTokenSesion();
  if (!token) redirect("/admin/login");
  return token;
}
