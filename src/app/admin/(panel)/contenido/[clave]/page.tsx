import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { Button } from "@/components/ui/button";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { exigirModulo } from "@/features/auth/server/dal";
import { FormularioEspacio } from "@/features/contenido/components/formulario-espacio";
import { porDefectoDeEspacios } from "@/features/contenido/espacios";
import { obtenerEspacioPanel } from "@/features/contenido/server/panel";
import { obtenerMedio } from "@/features/medios/server/api";
import type { Medio } from "@/features/medios/types";
import { ApiError } from "@/lib/api/errores";

export const metadata: Metadata = { title: "Editar contenido" };

export default function EspacioPage({ params }: PageProps<"/admin/contenido/[clave]">) {
  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/contenido">
          <ArrowLeft aria-hidden />
          Contenido del sitio
        </Link>
      </Button>
      <Suspense fallback={<CargandoPagina />}>
        <Editor params={params} />
      </Suspense>
    </>
  );
}

async function Editor({ params }: Pick<PageProps<"/admin/contenido/[clave]">, "params">) {
  const usuario = await exigirModulo("contenido");
  const clave = decodeURIComponent((await params).clave);
  const espacio = await obtenerEspacioPanel(clave).catch((error) => {
    if (error instanceof ApiError && error.noEncontrado) notFound();
    throw error;
  });

  // Los campos de imagen se guardan como id: se traen para mostrarlos.
  const imagenes: Record<string, Medio> = {};
  await Promise.all(
    espacio.campos
      .filter((c) => c.tipo === "imagen" && typeof espacio.datos?.[c.clave] === "number")
      .map(async (c) => {
        const medio = await obtenerMedio(espacio.datos![c.clave] as number).catch(() => null);
        if (medio) imagenes[c.clave] = medio;
      }),
  );

  return (
    <>
      <EncabezadoPagina titulo={espacio.nombre} descripcion={`Página: ${espacio.pagina}`} />
      <FormularioEspacio
        espacio={espacio}
        porDefecto={porDefectoDeEspacios[clave] ?? {}}
        imagenes={imagenes}
        puedeSubir={usuario.modulos.includes("medios")}
      />
    </>
  );
}
