import Image from "next/image";
import type { Bloque } from "../types";

/** Cuerpo de la noticia: un componente por tipo de bloque, con el mismo diseño en todas. */
export function BloquesNoticia({ bloques }: { bloques: Bloque[] }) {
  return (
    <div className="prosa">
      {bloques.map((bloque, i) => (
        <BloqueNoticia key={i} bloque={bloque} />
      ))}
    </div>
  );
}

function BloqueNoticia({ bloque }: { bloque: Bloque }) {
  switch (bloque.tipo) {
    case "texto":
      // HTML limpio en Django (nh3) antes de guardarse.
      return <div className="contents" dangerouslySetInnerHTML={{ __html: bloque.html }} />;

    case "cita":
      return (
        <figure className="my-10 border-l-4 border-catsa-green pl-6">
          <blockquote className="font-heading text-2xl leading-snug text-catsa-ink not-italic">
            “{bloque.texto}”
          </blockquote>
          {bloque.autor && (
            <figcaption className="mt-3 text-base text-catsa-muted">{bloque.autor}</figcaption>
          )}
        </figure>
      );

    case "cifras":
      return (
        <dl className="my-10 grid gap-6 rounded-xl bg-catsa-cream p-6 movil:grid-cols-2">
          {bloque.items.map((cifra) => (
            // La etiqueta va primero en el HTML (término → valor) y se muestra debajo de la cifra.
            <div key={cifra.etiqueta} className="flex flex-col-reverse">
              <dt className="mt-1 text-base text-catsa-body">{cifra.etiqueta}</dt>
              <dd className="font-heading text-4xl font-semibold text-catsa-green-d">{cifra.valor}</dd>
            </div>
          ))}
        </dl>
      );

    case "imagen":
      return (
        <figure className="my-10">
          <Image
            src={bloque.imagen.url}
            alt={bloque.imagen.alt}
            width={bloque.imagen.ancho ?? 1200}
            height={bloque.imagen.alto ?? 750}
            sizes="(min-width: 768px) 720px, 100vw"
            className="rounded-xl"
          />
          {bloque.pie && <figcaption className="mt-3 text-sm text-catsa-muted">{bloque.pie}</figcaption>}
        </figure>
      );
  }
}
