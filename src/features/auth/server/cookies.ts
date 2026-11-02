import "server-only";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

// El token de allauth vive solo en una cookie httpOnly: el navegador nunca lo
// ve ni lo puede leer con JavaScript. Next lo reenvía a Django desde el servidor.
export const COOKIE_SESION = "catsa_sesion";
// Entre la contraseña y el código 2FA el token todavía no está autenticado.
export const COOKIE_PENDIENTE = "catsa_sesion_pendiente";

const base = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

export async function leerTokenSesion() {
  return (await cookies()).get(COOKIE_SESION)?.value;
}

export async function leerTokenPendiente() {
  return (await cookies()).get(COOKIE_PENDIENTE)?.value;
}

export async function guardarSesion(token: string) {
  const almacen = await cookies();
  almacen.delete(COOKIE_PENDIENTE);
  // Sin maxAge: la vida real de la sesión la controla Django (cierre por inactividad).
  almacen.set(COOKIE_SESION, token, base);
}

export async function guardarPendiente(token: string) {
  (await cookies()).set(COOKIE_PENDIENTE, token, { ...base, maxAge: 60 * 5 });
}

export async function borrarSesion() {
  const almacen = await cookies();
  almacen.delete(COOKIE_SESION);
  almacen.delete(COOKIE_PENDIENTE);
}
