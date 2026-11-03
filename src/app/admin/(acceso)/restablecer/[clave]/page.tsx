import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { FormularioNuevaClave } from "@/features/auth/components/formulario-nueva-clave";
import { validarClaveRestablecer } from "@/features/auth/server/allauth";

export const metadata: Metadata = { title: "Crear contraseña" };

/** Llega desde la invitación o desde "¿Olvidó su contraseña?": el mismo enlace de un solo uso. */
export default function RestablecerPage({ params }: PageProps<"/admin/restablecer/[clave]">) {
  return (
    <>
      <h1 className="mt-6 text-xl text-catsa-ink">Crear contraseña</h1>
      <Suspense fallback={<Skeleton className="mt-6 h-48" />}>
        <Contenido params={params} />
      </Suspense>
    </>
  );
}

async function Contenido({ params }: Pick<PageProps<"/admin/restablecer/[clave]">, "params">) {
  const { clave } = await params;
  const email = await validarClaveRestablecer(decodeURIComponent(clave)).catch(() => null);

  if (email === null) {
    return (
      <>
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>
            Este enlace ya se usó o venció. Pida uno nuevo con «¿Olvidó su contraseña?», o pídale a un
            administrador que le reenvíe la invitación.
          </AlertDescription>
        </Alert>
        <p className="mt-6 text-center text-sm">
          <Link href="/admin/olvide" className="text-catsa-green underline underline-offset-4">
            Pedir un enlace nuevo
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <p className="mt-1 mb-6 text-sm text-catsa-muted">
        {email ? (
          <>
            Para <strong className="text-catsa-ink">{email}</strong>.{" "}
          </>
        ) : null}
        Use al menos 12 caracteres. Una frase de varias palabras es fácil de recordar y difícil de adivinar.
      </p>
      <FormularioNuevaClave clave={decodeURIComponent(clave)} email={email} />
    </>
  );
}
