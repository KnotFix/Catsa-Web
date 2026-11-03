import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormularioLogin } from "@/features/auth/components/formulario-login";

export const metadata: Metadata = { title: "Iniciar sesión" };

const AVISOS: Record<string, string> = {
  reingresar: "Por seguridad, vuelva a ingresar su contraseña para terminar de configurar la verificación.",
  "clave-creada": "Listo, su contraseña quedó guardada. Ingrese con ella.",
};

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <>
      <h1 className="mt-6 text-xl text-catsa-ink">Panel administrativo</h1>
      <p className="mt-1 mb-6 text-sm text-catsa-muted">Ingrese con su cuenta de CATSA.</p>
      <Suspense>
        <Aviso searchParams={searchParams} />
      </Suspense>
      <FormularioLogin />
      <p className="mt-6 text-center text-sm">
        <Link href="/admin/olvide" className="text-catsa-green underline underline-offset-4">
          ¿Olvidó su contraseña?
        </Link>
      </p>
    </>
  );
}

async function Aviso({ searchParams }: Pick<PageProps<"/admin/login">, "searchParams">) {
  const { motivo } = await searchParams;
  const aviso = typeof motivo === "string" ? AVISOS[motivo] : undefined;
  if (!aviso) return null;
  return (
    <Alert className="mb-5">
      <AlertDescription>{aviso}</AlertDescription>
    </Alert>
  );
}
