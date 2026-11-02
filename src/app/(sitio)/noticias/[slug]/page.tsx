import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contenedor } from "@/components/shared/contenedor";
import { Skeleton } from "@/components/ui/skeleton";
import { obtenerNoticia } from "@/features/noticias/api";
import { ArticuloNoticia } from "@/features/noticias/components/articulo-noticia";

export async function generateMetadata({ params }: PageProps<"/noticias/[slug]">): Promise<Metadata> {
  const noticia = await obtenerNoticia((await params).slug);
  if (!noticia) return {};
  return {
    title: noticia.titulo,
    description: noticia.resumen,
    openGraph: {
      type: "article",
      publishedTime: noticia.publicada_en,
      authors: noticia.autor ? [noticia.autor] : undefined,
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

  return <ArticuloNoticia noticia={noticia} />;
}
