"use server";

import { redirect } from "next/navigation";
import { autenticar2fa, cerrarSesionRemota, login } from "./server/allauth";
import {
  borrarSesion,
  guardarPendiente,
  guardarSesion,
  leerTokenPendiente,
  leerTokenSesion,
} from "./server/cookies";
import { esquemaCodigo, esquemaLogin } from "./schemas";
import type { EstadoFormulario } from "./types";

const SIN_CONEXION = "No pudimos conectar con el servidor. Intente de nuevo.";

export async function iniciarSesion(_: EstadoFormulario, datos: FormData): Promise<EstadoFormulario> {
  const campos = esquemaLogin.safeParse(Object.fromEntries(datos));
  if (!campos.success) return { error: campos.error.issues[0].message };

  const resultado = await login(campos.data.email, campos.data.password).catch(() => null);
  if (!resultado) return { error: SIN_CONEXION };
  if (resultado.tipo === "error") return { error: resultado.mensaje };

  if (resultado.tipo === "requiere_2fa") {
    await guardarPendiente(resultado.token);
    redirect("/admin/verificar");
  }
  // Usuario sin 2FA configurada: entra, y la API solo le permite configurarla.
  await guardarSesion(resultado.token);
  redirect("/admin");
}

export async function verificarCodigo(_: EstadoFormulario, datos: FormData): Promise<EstadoFormulario> {
  const campos = esquemaCodigo.safeParse(Object.fromEntries(datos));
  if (!campos.success) return { error: campos.error.issues[0].message };

  const token = await leerTokenPendiente();
  if (!token) redirect("/admin/login");

  const resultado = await autenticar2fa(token, campos.data.codigo).catch(() => null);
  if (!resultado) return { error: SIN_CONEXION };
  if (resultado.tipo !== "autenticado") return { error: "El código no es válido o ya venció." };

  await guardarSesion(resultado.token);
  redirect("/admin");
}

export async function cerrarSesion() {
  const token = await leerTokenSesion();
  if (token) await cerrarSesionRemota(token);
  await borrarSesion();
  redirect("/admin/login");
}
