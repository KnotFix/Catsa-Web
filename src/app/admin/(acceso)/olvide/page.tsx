import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormularioOlvide } from "@/features/auth/components/formulario-olvide";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export default function OlvidePage({ searchParams }: PageProps<"/admin/olvide">) {
  return (
    <>
      <h1 className="mt-6 text-xl text-catsa-ink">¿Olvidó su contraseña?</h1>
      <Suspense>
        <Contenido searchParams={searchParams} />
      </Suspense>
      <p className="mt-6 text-center text-sm">
        <Link href="/admin/login" className="text-catsa-green underline underline-offset-4">
          Volver a iniciar sesión
        </Link>
      </p>
    </>
  );
}

async function Contenido({ searchParams }: Pick<PageProps<"/admin/olvide">, "searchParams">) {
  const { enviado } = await searchParams;
  if (enviado) {
    // Mismo mensaje exista o no la cuenta: no se revela qué correos tienen acceso.
    return (
      <Alert className="mt-6">
        <AlertDescription>
          Si ese correo tiene una cuenta activa, le llegará un enlace para crear una contraseña nueva. Revise
          también la carpeta de correo no deseado. El enlace vence en 3 días.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <>
      <p className="mt-1 mb-6 text-sm text-catsa-muted">
        Escriba su correo y le enviaremos un enlace para crear una nueva. La verificación en dos pasos se
        mantiene.
      </p>
      <FormularioOlvide />
    </>
  );
}
