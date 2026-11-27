import type { Route } from "next";
import Link from "next/link";
import { CieloPradera } from "./pradera/cielo-pradera";
import { Titular } from "./titular";

/**
 * Cierre de página: el titular y las acciones sobre un cielo crema con colinas
 * de caña (<CieloPradera>, adaptado de "Meadow Rise Footer"). La colina más
 * cercana se oscurece en el verde del pie, que sigue debajo sin corte. El cielo
 * arranca del fondo de la sección anterior: `sobreCrema` cuando es crema.
 */
export function Cierre({
  antetitulo,
  titulo,
  texto,
  principal,
  secundario,
  sobreCrema,
}: {
  antetitulo: string;
  titulo: string;
  texto: string;
  principal: { titulo: string; href: Route };
  secundario?: { titulo: string; href: Route };
  sobreCrema?: boolean;
}) {
  return (
    <section className="cta-final">
      <CieloPradera arriba={sobreCrema ? "cream" : "paper"} />
      <div className="cin" data-reveal>
        <span className="eyebrow">{antetitulo}</span>
        <Titular texto={titulo} />
        <p>{texto}</p>
        <div className="cta-actions">
          <Link className="cta-pill" href={principal.href}>
            <span>{principal.titulo}</span>
            <span className="cta-flecha" aria-hidden>
              <svg viewBox="0 0 16 16" width="12" height="12">
                <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
              </svg>
            </span>
          </Link>
          {secundario && (
            <Link className="cta-linea" href={secundario.href}>
              {secundario.titulo}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
