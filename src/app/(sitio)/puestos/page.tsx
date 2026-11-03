import { Suspense } from "react";
import type { Metadata } from "next";
import { SeccionSitio } from "@/components/shared/seccion-sitio";
import { Skeleton } from "@/components/ui/skeleton";
import { FiltrosPuestos } from "@/features/puestos/components/filtros-puestos";
import { ListaPuestos } from "@/features/puestos/components/lista-puestos";

export const metadata: Metadata = {
  title: "Trabaje con nosotros",
  description: "Puestos abiertos en CATSA.",
};

export default function PuestosPage({ searchParams }: PageProps<"/puestos">) {
  return (
    <SeccionSitio
      antetitulo="Trabaje con nosotros"
      titulo="Puestos disponibles"
      bajada="Las mismas vacantes que compartimos en redes, con toda la información en un solo lugar."
      icono={
        <>
          <path pathLength={1} d="M4 7h16v13H4z" />
          <path pathLength={1} d="M9 7V4h6v3" />
        </>
      }
    >
      <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
        <Listado searchParams={searchParams} />
      </Suspense>
    </SeccionSitio>
  );
}

async function Listado({ searchParams }: Pick<PageProps<"/puestos">, "searchParams">) {
  const { area, ubicacion } = await searchParams;
  const elegidos = {
    area: typeof area === "string" ? area : undefined,
    ubicacion: typeof ubicacion === "string" ? ubicacion : undefined,
  };
  return (
    <>
      <FiltrosPuestos elegidos={elegidos} />
      <ListaPuestos filtros={elegidos} />
    </>
  );
}
