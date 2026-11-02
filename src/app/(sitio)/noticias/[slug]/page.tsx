import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Contenedor } from "@/components/shared/contenedor";
import { Skeleton } from "@/components/ui/skeleton";
import { obtenerNoticia } from "@/features/noticias/api";
import { formatearFecha } from "@/lib/formato";

export async function generateMetadata({ params }: PageProps<"/noticias/[slug]">): Promise<Metadata> {
  const noticia = await obtenerNoticia((await params).slug);
  if (!noticia) return {};
  return {
    title: noticia.titulo,
    description: noticia.resumen,
    openGraph: {
      type: "article",
      publishedTime: noticia.publicada_en,
      images: noticia.portada ? [{ url: noticia.portada.url, alt: noticia.portada.alt }] : undefined,
    },
  };
}

// El slug se conoce en la petición, así que el artículo va detrás de Suspense.
// La lectura en sí está en caché (obtenerNoticia), así que el costo es mínimo.
export default function NoticiaPage({ params }: PageProps<"/noticias/[slug]">) {
  return (
    <Contenedor className="max-w-3xl py-16 tablet:py-24">
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <Articulo params={params} />
      </Suspense>
    </Contenedor>
  );
}

async function Articulo({ params }: Pick<PageProps<"/noticias/[slug]">, "params">) {
  const noticia = await obtenerNoticia((await params).slug);
  if (!noticia) notFound();

  return (
    <article>
      <time
        dateTime={noticia.publicada_en}
        className="text-xs font-semibold tracking-wider text-catsa-brown uppercase"
      >
        {formatearFecha(noticia.publicada_en)}
      </time>
      <h1 className="mt-3 text-3xl text-catsa-ink tablet:text-4xl">{noticia.titulo}</h1>
      {noticia.portada && (
        <Image
          src={noticia.portada.url}
          alt={noticia.portada.alt}
          width={noticia.portada.ancho ?? 1200}
          height={noticia.portada.alto ?? 750}
          className="mt-8 rounded-xl"
          priority
        />
      )}
      {/* HTML sanitizado en Django (nh3) antes de guardarse. */}
      <div className="prosa mt-8" dangerouslySetInnerHTML={{ __html: noticia.cuerpo }} />
    </article>
  );
}
