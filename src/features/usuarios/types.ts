import type { Esquemas } from "@/lib/api/tipos";

export type UsuarioPanel = Esquemas["UsuarioPanel"];
export type Acceso = Esquemas["Acceso"];
export type EventoAcceso = Esquemas["EventoAcceso"];
export type DatosUsuario = Pick<UsuarioPanel, "first_name" | "last_name" | "departamento" | "modulos">;
export type Invitacion = DatosUsuario & { email: string };

export const eventosAcceso: Record<EventoAcceso, string> = {
  entrada: "Inicio de sesión",
  salida: "Cierre de sesión",
  fallido: "Intento fallido",
};

/** Cómo está la cuenta, en una palabra para el listado. */
export function estadoCuenta(u: UsuarioPanel): { texto: string; tono: "ok" | "aviso" | "apagado" } {
  if (!u.activo) return { texto: "Desactivada", tono: "apagado" };
  if (u.invitacion_pendiente) return { texto: "Invitación pendiente", tono: "aviso" };
  if (!u.tiene_2fa) return { texto: "Sin verificación", tono: "aviso" };
  return { texto: "Activa", tono: "ok" };
}

export type Cambio = Esquemas["Cambio"];
