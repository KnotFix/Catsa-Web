import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { Configurar2fa } from "@/features/auth/components/configurar-2fa";
import { obtenerTotp } from "@/features/auth/server/allauth";
import { obtenerUsuario, tokenParaApi } from "@/features/auth/server/dal";
import { qrSvg } from "@/features/auth/server/qr";

export const metadata: Metadata = { title: "Configurar verificación en dos pasos" };

// Paso obligatorio: el panel manda aquí a todo usuario sin 2FA (exigirPanel).
export default function Configurar2faPage() {
  return (
    <>
      <h1 className="mt-6 text-xl text-catsa-ink">Verificación en dos pasos</h1>
      <p className="mt-1 mb-6 text-sm text-catsa-muted">
        Para entrar al panel, cada usuario protege su cuenta con un código de su teléfono.
      </p>
      <Suspense fallback={<CargandoPagina />}>
        <Contenido />
      </Suspense>
    </>
  );
}

async function Contenido() {
  const usuario = await obtenerUsuario();
  if (usuario.tiene_2fa) redirect("/admin");

  const totp = await obtenerTotp(await tokenParaApi());
  if (totp.activo) redirect("/admin");

  return <Configurar2fa qr={await qrSvg(totp.url)} secreto={totp.secreto} />;
}
