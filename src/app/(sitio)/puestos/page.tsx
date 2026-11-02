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
    <SeccionSitio antetitulo="Trabaje con nosotros" titulo="Puestos abiertos">
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
