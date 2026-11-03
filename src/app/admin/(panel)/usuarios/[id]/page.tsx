import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { exigirModulo } from "@/features/auth/server/dal";
import { AccionesUsuario } from "@/features/usuarios/components/acciones-usuario";
import { FormularioUsuario } from "@/features/usuarios/components/formulario-usuario";
import { obtenerUsuarioPanel } from "@/features/usuarios/server/api";
import { estadoCuenta } from "@/features/usuarios/types";
import { ApiError } from "@/lib/api/errores";
import { formatearFecha } from "@/lib/formato";

export const metadata: Metadata = { title: "Usuario" };

export default function UsuarioPage({ params, searchParams }: PageProps<"/admin/usuarios/[id]">) {
  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/usuarios">
          <ArrowLeft aria-hidden />
          Usuarios
        </Link>
      </Button>
      <Suspense fallback={<CargandoPagina />}>
        <Detalle params={params} searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Detalle({ params, searchParams }: PageProps<"/admin/usuarios/[id]">) {
  const yo = await exigirModulo("administracion");
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const usuario = await obtenerUsuarioPanel(id).catch((error) => {
    if (error instanceof ApiError && error.noEncontrado) notFound();
    throw error;
  });
  const { invitado } = await searchParams;

  return (
    <>
      <EncabezadoPagina
        titulo={usuario.nombre}
        descripcion={`${usuario.email} · ${estadoCuenta(usuario).texto}${
          usuario.ultimo_ingreso ? ` · último ingreso el ${formatearFecha(usuario.ultimo_ingreso)}` : ""
        }`}
      />
      {invitado && (
        <Alert className="mb-6 max-w-2xl">
          <AlertDescription>
            Invitación enviada a {usuario.email}. El enlace vence en 3 días; si no le llega, puede reenviarla
            desde aquí.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-10 nav:grid-cols-[1fr_18rem]">
        <FormularioUsuario usuario={usuario} />
        <aside className="grid content-start gap-3">
          <h2 className="text-sm font-semibold text-catsa-ink">Cuenta</h2>
          <AccionesUsuario usuario={usuario} esUnoMismo={usuario.id === yo.id} />
        </aside>
      </div>
    </>
  );
}
