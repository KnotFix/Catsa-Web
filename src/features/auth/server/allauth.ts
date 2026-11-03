import "server-only";
import { headers } from "next/headers";
import { ApiError } from "@/lib/api/errores";
import { apiFetch } from "@/lib/api/http";

// Cliente "app" de django-allauth headless: la sesión se identifica con un
// token (X-Session-Token) en lugar de la cookie de Django.
const BASE = "/_allauth/app/v1";

type Flujo = { id: string; is_pending?: boolean };

type RespuestaAllauth = {
  status: number;
  data?: { flows?: Flujo[]; unused_codes?: string[] };
  meta?: { is_authenticated?: boolean; session_token?: string; secret?: string; totp_url?: string };
  errors?: { message: string; code: string; param?: string }[];
};

export type ResultadoAcceso =
  | { tipo: "autenticado"; token: string }
  | { tipo: "requiere_2fa"; token: string }
  | { tipo: "error"; mensaje: string };

function interpretar(r: RespuestaAllauth, tokenPrevio?: string): ResultadoAcceso {
  const token = r.meta?.session_token ?? tokenPrevio;
  if (r.meta?.is_authenticated && token) return { tipo: "autenticado", token };
  if (pide(r, "mfa_authenticate") && token) return { tipo: "requiere_2fa", token };
  return { tipo: "error", mensaje: r.errors?.[0]?.message ?? "Correo o contraseña incorrectos." };
}

function pide(r: RespuestaAllauth, flujo: string) {
  return r.data?.flows?.some((f) => f.id === flujo && (f.is_pending ?? true)) ?? false;
}

/**
 * Quién hace la petición de verdad. Django la recibe desde este servidor, así
 * que sin esto el registro de accesos y el bloqueo por intentos fallidos
 * (django-axes, por correo + IP) verían siempre la IP y el navegador de Next.
 */
async function datosDelVisitante(): Promise<Record<string, string>> {
  const entrante = await headers();
  const ip = entrante.get("x-forwarded-for")?.split(",")[0]?.trim();
  const agente = entrante.get("user-agent");
  return { ...(ip && { "X-Forwarded-For": ip }), ...(agente && { "User-Agent": agente }) };
}

async function llamar(ruta: string, opciones: Parameters<typeof apiFetch>[1] = {}) {
  try {
    return await apiFetch<RespuestaAllauth>(`${BASE}${ruta}`, {
      ...opciones,
      headers: { ...(await datosDelVisitante()), ...opciones?.headers },
    });
  } catch (error) {
    // allauth responde los 4xx con un cuerpo útil (errores, flujos pendientes,
    // o el secreto TOTP cuando todavía no hay uno activo).
    if (error instanceof ApiError && error.cuerpo && error.status >= 400 && error.status < 500) {
      return error.cuerpo as RespuestaAllauth;
    }
    throw error;
  }
}

// --- Acceso -----------------------------------------------------------------

export async function login(email: string, password: string) {
  return interpretar(await llamar("/auth/login", { method: "POST", body: { email, password } }));
}

export async function autenticar2fa(token: string, codigo: string) {
  return interpretar(
    await llamar("/auth/2fa/authenticate", { method: "POST", body: { code: codigo }, token }),
    token,
  );
}

/**
 * allauth exige haber reconfirmado la contraseña hace menos de 5 minutos para
 * tocar la 2FA. Se hace justo después del login de un usuario sin 2FA, así
 * puede configurarla sin volver a escribir la contraseña.
 */
export async function reautenticar(token: string, password: string) {
  const r = await llamar("/auth/reauthenticate", { method: "POST", body: { password }, token });
  return r.status === 200;
}

export async function cerrarSesionRemota(token: string) {
  await llamar("/auth/session", { method: "DELETE", token }).catch(() => undefined);
}

// --- 2FA --------------------------------------------------------------------

export type EstadoTotp = { activo: true } | { activo: false; secreto: string; url: string };

/** Si no hay TOTP activo, allauth genera un secreto nuevo para configurarlo. */
export async function obtenerTotp(token: string): Promise<EstadoTotp> {
  const r = await llamar("/account/authenticators/totp", { token });
  if (r.status === 200) return { activo: true };
  if (r.status === 404 && r.meta?.secret && r.meta.totp_url) {
    return { activo: false, secreto: r.meta.secret, url: r.meta.totp_url };
  }
  throw new ApiError(r.status, r);
}

export type ResultadoActivacion =
  { tipo: "activado" } | { tipo: "codigo_invalido" } | { tipo: "requiere_reautenticar" };

export async function activarTotp(token: string, codigo: string): Promise<ResultadoActivacion> {
  const r = await llamar("/account/authenticators/totp", { method: "POST", body: { code: codigo }, token });
  if (r.status === 200) return { tipo: "activado" };
  if (r.status === 401 && pide(r, "reauthenticate")) return { tipo: "requiere_reautenticar" };
  return { tipo: "codigo_invalido" };
}

/** Solo devuelve los códigos la primera vez que se piden (MFA_RECOVERY_CODES_SHOW_ONCE). */
export async function codigosDeRespaldo(token: string): Promise<string[]> {
  const r = await llamar("/account/authenticators/recovery-codes", { token });
  return r.data?.unused_codes ?? [];
}

// --- Contraseña -------------------------------------------------------------
// La invitación y "¿Olvidó su contraseña?" usan el mismo enlace de allauth:
// /admin/restablecer/<clave>, de un solo uso y con vencimiento.

/** Siempre responde igual, exista o no el correo: no revela qué cuentas hay. */
export async function pedirRestablecer(email: string) {
  await llamar("/auth/password/request", { method: "POST", body: { email } });
}

/** Correo de la cuenta si el enlace sirve; null si venció o ya se usó. */
export async function validarClaveRestablecer(clave: string): Promise<string | null> {
  const r = (await llamar("/auth/password/reset", {
    headers: { "X-Password-Reset-Key": clave },
  })) as RespuestaAllauth & { data?: { user?: { email?: string } } };
  return r.status === 200 ? (r.data?.user?.email ?? "") : null;
}

export type ResultadoRestablecer =
  { tipo: "listo" } | { tipo: "clave_invalida" } | { tipo: "error"; mensaje: string };

export async function restablecerClave(clave: string, password: string): Promise<ResultadoRestablecer> {
  const r = await llamar("/auth/password/reset", { method: "POST", body: { key: clave, password } });
  // 401: la contraseña quedó guardada y allauth pide iniciar sesión (no entra solo, a propósito).
  if (r.status === 200 || r.status === 401) return { tipo: "listo" };
  const error = r.errors?.[0];
  if (error?.param === "key") return { tipo: "clave_invalida" };
  return { tipo: "error", mensaje: error?.message ?? "No se pudo guardar la contraseña." };
}
