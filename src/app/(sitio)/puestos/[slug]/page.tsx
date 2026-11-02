import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contenedor } from "@/components/shared/contenedor";
import { Skeleton } from "@/components/ui/skeleton";
import { obtenerPuesto } from "@/features/puestos/api";
import { DetallePuesto } from "@/features/puestos/components/detalle-puesto";

export async function generateMetadata({ params }: PageProps<"/puestos/[slug]">): Promise<Metadata> {
  const puesto = await obtenerPuesto((await params).slug);
  if (!puesto) return {};
  return {
    title: puesto.titulo,
    description: puesto.resumen,
    openGraph: { title: `${puesto.titulo} · CATSA`, description: puesto.resumen },
  };
}

export default function PuestoPage({ params }: PageProps<"/puestos/[slug]">) {
  return (
    <Contenedor className="max-w-3xl py-16 tablet:py-24">
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <Detalle params={params} />
      </Suspense>
    </Contenedor>
  );
}

async function Detalle({ params }: Pick<PageProps<"/puestos/[slug]">, "params">) {
  const puesto = await obtenerPuesto((await params).slug);
  if (!puesto) notFound();

  return <DetallePuesto puesto={puesto} />;
}
