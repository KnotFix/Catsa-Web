import Image from "next/image";
import Link from "next/link";
import { Etiqueta } from "@/components/shared/etiqueta";
import { formatearFecha } from "@/lib/formato";
import { cn } from "@/lib/utils";
import { ImagenSubida } from "@/features/medios/components/imagen-subida";
import { fotoDeRespaldo } from "../respaldo";
import type { NoticiaResumen } from "../types";

/**
 * Tarjeta de noticia.
 * - "columna": foto arriba y texto abajo (listado y grillas).
 * - "destacada": la primera de la portada, más grande.
 * - "fila": foto a la izquierda y texto a la derecha (las que acompañan a la destacada).
 * Sin portada en el panel, lleva una foto de CATSA (respaldo.ts).
 */
export function TarjetaNoticia({
  noticia,
  forma = "columna",
}: {
  noticia: NoticiaResumen;
  forma?: "columna" | "destacada" | "fila";
}) {
  const fila = forma === "fila";
  const destacada = forma === "destacada";
  const respaldo = fotoDeRespaldo(noticia.slug);
  const tamanos = destacada
    ? "(min-width: 900px) 58vw, 100vw"
    : fila
      ? "(min-width: 900px) 18vw, 40vw"
      : "(min-width: 900px) 33vw, 100vw";

  return (
    <article
      className={cn(
        "group h-full overflow-hidden rounded-2xl border bg-card transition-[box-shadow,border-color] duration-300 ease-catsa hover:border-catsa-green/30 hover:shadow-lg",
      )}
    >
      <Link href={`/noticias/${noticia.slug}`} className={cn("flex h-full", fila ? "flex-row" : "flex-col")}>
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-catsa-cream-2",
            destacada && "aspect-[16/9]",
            fila && "min-h-full w-[38%]",
            forma === "columna" && "aspect-[16/10]",
          )}
        >
          {noticia.portada ? (
            <ImagenSubida
              src={noticia.portada.url}
              alt={noticia.portada.alt}
              fill
              sizes={tamanos}
              className="object-cover transition-transform duration-700 ease-catsa group-hover:scale-[1.04]"
            />
          ) : (
            <Image
              src={respaldo.src}
              alt={respaldo.alt}
              fill
              sizes={tamanos}
              className="object-cover transition-transform duration-700 ease-catsa group-hover:scale-[1.04]"
            />
          )}
        </div>
        <div className={cn("flex flex-1 flex-col", destacada ? "p-6 tablet:p-8" : "p-5")}>
          <div className="flex flex-wrap items-center gap-3">
            {noticia.categoria && (
              <Etiqueta color={noticia.categoria.color}>{noticia.categoria.nombre}</Etiqueta>
            )}
            <time
              dateTime={noticia.publicada_en}
              className="text-xs font-semibold tracking-wider text-catsa-brown uppercase"
            >
              {formatearFecha(noticia.publicada_en)}
            </time>
          </div>
          <h3
            className={cn(
              "mt-3 text-catsa-ink transition-colors group-hover:text-catsa-green",
              destacada ? "text-2xl leading-tight tablet:text-[28px]" : "text-lg leading-snug",
              fila && "line-clamp-3",
            )}
          >
            {noticia.titulo}
          </h3>
          {!fila && (
            <p
              className={cn(
                "mt-2 text-catsa-body",
                destacada ? "line-clamp-3 text-base" : "line-clamp-3 text-sm",
              )}
            >
              {noticia.resumen}
            </p>
          )}
          <span className="mt-auto pt-4 text-sm font-bold text-catsa-green">
            Leer noticia{" "}
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 ease-catsa group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
