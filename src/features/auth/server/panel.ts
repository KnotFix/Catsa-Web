import "server-only";
import { redirect } from "next/navigation";
import { ApiError, esFalloDeRed } from "@/lib/api/errores";
import { apiFetch } from "@/lib/api/http";
import type { Resultado } from "@/lib/api/resultado";
import { tokenParaApi } from "./dal";

type Opciones = Parameters<typeof apiFetch>[1];

/**
 * Cliente de la API para el panel: lleva el token de la sesión. Django decide
 * los permisos (2FA + módulo). Sin sesión se vuelve al login; sin permiso, al
 * inicio del panel. Nunca se usa dentro de "use cache": es por usuario.
 */
export async function apiPanel<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
  const token = await tokenParaApi();
  try {
    return await apiFetch<T>(ruta, { ...opciones, token, timeoutMs: 20_000 });
  } catch (error) {
    if (error instanceof ApiError && error.noAutorizado) redirect("/admin/login");
    if (error instanceof ApiError && error.status === 403) redirect("/admin");
    throw error;
  }
}

/**
 * Para Server Actions: convierte los errores esperables (validación de Django,
 * API caída) en un Resultado que el formulario muestra. Lo demás se propaga.
 */
export async function intentar<T>(accion: () => Promise<T>): Promise<Resultado<T>> {
  try {
    return { ok: true, datos: await accion() };
  } catch (error) {
    if (error instanceof ApiError && (error.status === 400 || error.noEncontrado)) {
      return { ok: false, ...leerErrores(error.cuerpo) };
    }
    if (esFalloDeRed(error)) {
      return { ok: false, error: "No pudimos conectar con el servidor. Intente de nuevo." };
    }
    throw error;
  }
}

/**
 * DRF responde `{"detail": "…"}` o `{"campo": ["…"]}` (a veces anidado, como
 * en los bloques de una noticia). Se toma el primer mensaje de cada campo.
 */
function leerErrores(cuerpo: unknown): { error: string; campos: Record<string, string> } {
  if (!cuerpo || typeof cuerpo !== "object") return { error: "No se pudo guardar.", campos: {} };
  const campos: Record<string, string> = {};
  for (const [campo, valor] of Object.entries(cuerpo)) {
    const mensaje = primerMensaje(valor);
    if (mensaje) campos[campo] = mensaje;
  }
  const { detail, non_field_errors, ...resto } = campos;
  const general = detail ?? non_field_errors ?? Object.values(resto)[0] ?? "No se pudo guardar.";
  return { error: general, campos: resto };
}

function primerMensaje(valor: unknown): string | undefined {
  if (typeof valor === "string") return valor;
  if (Array.isArray(valor)) return valor.map(primerMensaje).find(Boolean);
  if (valor && typeof valor === "object") return Object.values(valor).map(primerMensaje).find(Boolean);
}
