import "server-only";
import { env } from "@/lib/env";
import { ApiError } from "./errores";

type Opciones = Omit<RequestInit, "body"> & {
  /** Se serializa como JSON. */
  body?: unknown;
  /** Token de sesión de allauth; se manda como X-Session-Token. */
  token?: string;
  timeoutMs?: number;
};

/**
 * Único punto de salida hacia Catsa-Api. Todas las funciones de datos de
 * `features/*` pasan por aquí: así el manejo de errores, cabeceras y tiempos
 * de espera es el mismo en todo el proyecto.
 */
export async function apiFetch<T>(
  ruta: string,
  { body, token, timeoutMs = 8000, headers, ...init }: Opciones = {},
): Promise<T> {
  const respuesta = await fetch(new URL(ruta, env.API_URL), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(token && { "X-Session-Token": token }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });

  const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null);
  if (!respuesta.ok) throw new ApiError(respuesta.status, datos);
  return datos as T;
}
