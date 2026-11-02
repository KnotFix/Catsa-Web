import type { Modulo } from "@/config/modulos";

/** Lo mínimo que el front necesita del usuario. Sale de /api/cuentas/yo/. */
export type Usuario = {
  id: number;
  nombre: string;
  email: string;
  modulos: Modulo[];
  tiene_2fa: boolean;
};

/** Estado que devuelven las acciones de los formularios de acceso. */
export type EstadoFormulario = { error?: string } | undefined;

/** Al activar la 2FA: los códigos de respaldo, que se muestran una sola vez. */
export type EstadoActivacion = { error?: string; codigos?: string[] } | undefined;
