import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contenedor } from "@/components/shared/contenedor";
import { Skeleton } from "@/components/ui/skeleton";
import { obtenerPuesto } from "@/features/puestos/api";

export async function generateMetadata({ params }: PageProps<"/puestos/[slug]">): Promise<Metadata> {
  const puesto = await obtenerPuesto((await params).slug);
  return puesto ? { title: puesto.titulo } : {};
}

export default function PuestoPage({ params }: PageProps<"/puestos/[slug]">) {
  return (
    <Contenedor className="max-w-3xl py-16 tablet:py-24">
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <DetallePuesto params={params} />
      </Suspense>
    </Contenedor>
  );
}

async function DetallePuesto({ params }: Pick<PageProps<"/puestos/[slug]">, "params">) {
  const puesto = await obtenerPuesto((await params).slug);
  if (!puesto) notFound();

  return (
    <article>
      <p className="text-sm text-catsa-muted">
        {puesto.area} · {puesto.ubicacion}
      </p>
      <h1 className="mt-2 text-3xl text-catsa-ink tablet:text-4xl">{puesto.titulo}</h1>
      {/* HTML sanitizado en Django (nh3) antes de guardarse. */}
      <div className="prosa mt-8" dangerouslySetInnerHTML={{ __html: puesto.descripcion }} />
      <div className="mt-10 rounded-xl bg-catsa-sprout-bg p-6">
        <h2 className="text-lg text-catsa-green-d">Cómo aplicar</h2>
        <p className="mt-2 text-catsa-body">{puesto.como_aplicar}</p>
      </div>
    </article>
  );
}
