import "server-only";
import { ApiError } from "@/lib/api/errores";
import { apiFetch } from "@/lib/api/http";

// Cliente "app" de django-allauth headless: la sesión se identifica con un
// token (X-Session-Token) en lugar de la cookie de Django.
const BASE = "/_allauth/app/v1";

type RespuestaAllauth = {
  status: number;
  data?: { flows?: { id: string; is_pending?: boolean }[] };
  meta?: { is_authenticated?: boolean; session_token?: string };
  errors?: { message: string; code: string; param?: string }[];
};

export type ResultadoAcceso =
  | { tipo: "autenticado"; token: string }
  | { tipo: "requiere_2fa"; token: string }
  | { tipo: "error"; mensaje: string };

function interpretar(r: RespuestaAllauth, tokenPrevio?: string): ResultadoAcceso {
  const token = r.meta?.session_token ?? tokenPrevio;
  if (r.meta?.is_authenticated && token) return { tipo: "autenticado", token };
  const pide2fa = r.data?.flows?.some((f) => f.id === "mfa_authenticate" && f.is_pending);
  if (pide2fa && token) return { tipo: "requiere_2fa", token };
  return { tipo: "error", mensaje: r.errors?.[0]?.message ?? "Correo o contraseña incorrectos." };
}

async function llamar(ruta: string, opciones: Parameters<typeof apiFetch>[1]) {
  try {
    return await apiFetch<RespuestaAllauth>(`${BASE}${ruta}`, opciones);
  } catch (error) {
    // allauth responde 400/401 con un cuerpo útil (errores o flujos pendientes).
    if (error instanceof ApiError && error.cuerpo && (error.status === 400 || error.status === 401)) {
      return error.cuerpo as RespuestaAllauth;
    }
    throw error;
  }
}

export async function login(email: string, password: string) {
  return interpretar(await llamar("/auth/login", { method: "POST", body: { email, password } }));
}

export async function autenticar2fa(token: string, codigo: string) {
  return interpretar(
    await llamar("/auth/2fa/authenticate", { method: "POST", body: { code: codigo }, token }),
    token,
  );
}

export async function cerrarSesionRemota(token: string) {
  await llamar("/auth/session", { method: "DELETE", token }).catch(() => undefined);
}
