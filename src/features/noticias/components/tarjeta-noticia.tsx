import Image from "next/image";
import Link from "next/link";
import { formatearFecha } from "@/lib/formato";
import type { NoticiaResumen } from "../types";

export function TarjetaNoticia({ noticia }: { noticia: NoticiaResumen }) {
  return (
    <article className="group overflow-hidden rounded-xl border bg-card transition-shadow duration-300 ease-catsa hover:shadow-lg">
      <Link href={`/noticias/${noticia.slug}`} className="block">
        <div className="relative aspect-[16/10] bg-catsa-cream-2">
          {noticia.portada && (
            <Image
              src={noticia.portada.url}
              alt={noticia.portada.alt}
              fill
              sizes="(min-width: 900px) 33vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <div className="p-5">
          <time
            dateTime={noticia.publicada_en}
            className="text-xs font-semibold tracking-wider text-catsa-brown uppercase"
          >
            {formatearFecha(noticia.publicada_en)}
          </time>
          <h3 className="mt-2 text-lg text-catsa-ink group-hover:text-catsa-green">{noticia.titulo}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-catsa-body">{noticia.resumen}</p>
        </div>
      </Link>
    </article>
  );
}
