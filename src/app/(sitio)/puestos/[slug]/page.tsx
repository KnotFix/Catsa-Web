import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contenedor } from "@/components/shared/contenedor";
import { Etiqueta } from "@/components/shared/etiqueta";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { obtenerPuesto } from "@/features/puestos/api";
import { formatearFecha } from "@/lib/formato";

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
        <DetallePuesto params={params} />
      </Suspense>
    </Contenedor>
  );
}

async function DetallePuesto({ params }: Pick<PageProps<"/puestos/[slug]">, "params">) {
  const puesto = await obtenerPuesto((await params).slug);
  if (!puesto) notFound();

  const asunto = encodeURIComponent(`Postulación: ${puesto.titulo}`);

  return (
    <article>
      <Etiqueta color={puesto.area.color}>{puesto.area.nombre}</Etiqueta>
      <h1 className="mt-3 text-3xl text-catsa-ink tablet:text-4xl">{puesto.titulo}</h1>
      <p className="mt-3 text-catsa-muted">
        {puesto.ubicacion} · {puesto.tipo_contrato}
        {puesto.cierra_el &&
          puesto.recibe_postulaciones &&
          ` · Cierra el ${formatearFecha(puesto.cierra_el)}`}
      </p>

      {!puesto.recibe_postulaciones && (
        <p role="status" className="mt-6 rounded-xl bg-catsa-amber-bg p-4 text-catsa-amber-ink">
          Este puesto ya no recibe postulaciones.
        </p>
      )}

      {puesto.resumen && <p className="mt-8 text-xl text-catsa-body">{puesto.resumen}</p>}
      <Seccion titulo="Descripción" html={puesto.descripcion} />
      <Seccion titulo="Requisitos" html={puesto.requisitos} />
      <Seccion titulo="Qué ofrecemos" html={puesto.ofrecemos} />

      {puesto.recibe_postulaciones && (
        <div className="mt-12 rounded-xl bg-catsa-sprout-bg p-6">
          <h2 className="text-lg text-catsa-green-d">Cómo aplicar</h2>
          <p className="mt-2 text-catsa-body">
            Envíe su currículum a <strong>{puesto.correo_contacto}</strong> indicando el nombre del puesto.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={`mailto:${puesto.correo_contacto}?subject=${asunto}`}>Enviar currículum</a>
            </Button>
            {puesto.ficha && (
              <Button asChild size="lg" variant="outline">
                <a href={puesto.ficha.url} target="_blank" rel="noopener noreferrer">
                  Descargar ficha (PDF)
                </a>
              </Button>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

function Seccion({ titulo, html }: { titulo: string; html: string }) {
  if (!html) return null;
  return (
    <section className="mt-10">
      <h2 className="text-2xl text-catsa-ink">{titulo}</h2>
      {/* HTML limpio en Django (nh3) antes de guardarse. */}
      <div className="prosa mt-4" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}
