import Image from "next/image";
import { Etiqueta } from "@/components/shared/etiqueta";
import { formatearFecha } from "@/lib/formato";
import type { Noticia } from "../types";
import { BloquesNoticia } from "./bloques-noticia";

/** La noticia tal como se ve en el sitio. La usa también la vista previa del panel. */
export function ArticuloNoticia({ noticia }: { noticia: Noticia }) {
  // En la vista previa de un borrador todavía no hay fecha de publicación.
  const fecha = noticia.publicada_en as string | null;
  return (
    <article>
      <div className="flex flex-wrap items-center gap-3">
        {noticia.categoria && <Etiqueta color={noticia.categoria.color}>{noticia.categoria.nombre}</Etiqueta>}
        <time
          dateTime={fecha ?? undefined}
          className="text-xs font-semibold tracking-wider text-catsa-brown uppercase"
        >
          {fecha ? formatearFecha(fecha) : "Sin publicar"}
        </time>
      </div>
      <h1 className="mt-3 text-3xl text-catsa-ink tablet:text-4xl">{noticia.titulo}</h1>
      {noticia.resumen && <p className="mt-4 text-xl text-catsa-body">{noticia.resumen}</p>}
      {noticia.autor && <p className="mt-4 text-sm text-catsa-muted">Por {noticia.autor}</p>}
      {noticia.portada && (
        <Image
          src={noticia.portada.url}
          alt={noticia.portada.alt}
          width={noticia.portada.ancho ?? 1200}
          height={noticia.portada.alto ?? 750}
          sizes="(min-width: 768px) 720px, 100vw"
          className="mt-8 rounded-xl"
          preload
        />
      )}
      <div className="mt-8">
        <BloquesNoticia bloques={noticia.bloques} />
      </div>
    </article>
  );
}
