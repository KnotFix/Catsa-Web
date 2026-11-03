"use server";

import { redirect } from "next/navigation";
import {
  activarTotp,
  autenticar2fa,
  cerrarSesionRemota,
  codigosDeRespaldo,
  login,
  pedirRestablecer,
  reautenticar,
  restablecerClave,
} from "./server/allauth";
import {
  borrarSesion,
  guardarPendiente,
  guardarSesion,
  leerTokenPendiente,
  leerTokenSesion,
} from "./server/cookies";
import { esquemaCodigo, esquemaCodigoApp, esquemaLogin, esquemaNuevaClave, esquemaOlvide } from "./schemas";
import type { EstadoActivacion, EstadoFormulario } from "./types";

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

  // Entró sin pedir código: todavía no tiene 2FA. Se reconfirma la contraseña
  // ahora (allauth lo exige para activarla) y va directo a configurarla.
  await reautenticar(resultado.token, campos.data.password).catch(() => false);
  await guardarSesion(resultado.token);
  redirect("/admin/configurar-2fa");
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

export async function activarDosPasos(_: EstadoActivacion, datos: FormData): Promise<EstadoActivacion> {
  const campos = esquemaCodigoApp.safeParse(Object.fromEntries(datos));
  if (!campos.success) return { error: campos.error.issues[0].message };

  const token = await leerTokenSesion();
  if (!token) redirect("/admin/login");

  const resultado = await activarTotp(token, campos.data.codigo).catch(() => null);
  if (!resultado) return { error: SIN_CONEXION };
  if (resultado.tipo === "codigo_invalido") {
    return { error: "El código no coincide. Revise que la hora del teléfono esté bien y pruebe de nuevo." };
  }
  if (resultado.tipo === "requiere_reautenticar") {
    // Pasaron más de 5 minutos desde el login: se vuelve a entrar para reconfirmar la contraseña.
    await cerrarSesionRemota(token);
    await borrarSesion();
    redirect("/admin/login?motivo=reingresar");
  }

  return { codigos: await codigosDeRespaldo(token).catch(() => []) };
}

export async function cerrarSesion() {
  const token = await leerTokenSesion();
  if (token) await cerrarSesionRemota(token);
  await borrarSesion();
  redirect("/admin/login");
}

export async function solicitarRestablecer(_: EstadoFormulario, datos: FormData): Promise<EstadoFormulario> {
  const campos = esquemaOlvide.safeParse(Object.fromEntries(datos));
  if (!campos.success) return { error: campos.error.issues[0].message };
  const enviado = await pedirRestablecer(campos.data.email)
    .then(() => true)
    .catch(() => false);
  if (!enviado) return { error: SIN_CONEXION };
  redirect("/admin/olvide?enviado=1");
}

export async function crearContrasena(
  clave: string,
  _: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  const campos = esquemaNuevaClave.safeParse(Object.fromEntries(datos));
  if (!campos.success) return { error: campos.error.issues[0].message };

  const resultado = await restablecerClave(clave, campos.data.password).catch(() => null);
  if (!resultado) return { error: SIN_CONEXION };
  if (resultado.tipo === "clave_invalida") redirect(`/admin/restablecer/${clave}`);
  if (resultado.tipo === "error") return { error: resultado.mensaje };
  redirect("/admin/login?motivo=clave-creada");
}
