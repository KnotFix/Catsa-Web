import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Titular } from "./titular";

/**
 * Cierre de página (.cta-final del boceto): franja verde claro con una ola
 * arriba que continúa el fondo de la sección anterior. `sobreCrema` cuando
 * esa sección es crema y no papel.
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
    <section className={cn("cta-final", sobreCrema && "on-cream")}>
      <svg className="wave" viewBox="0 0 1200 110" preserveAspectRatio="none" aria-hidden>
        <path d="M0,48 C220,104 420,4 660,36 C840,60 1020,72 1200,40 L1200,0 L0,0 Z" />
      </svg>
      <div className="cin" data-reveal>
        <div className="cbody">
          <span className="eyebrow">{antetitulo}</span>
          <Titular texto={titulo} />
          <p>{texto}</p>
        </div>
        <div className="cta-actions">
          <Link className="btn btn-primary" href={principal.href}>
            {principal.titulo}
          </Link>
          {secundario && (
            <Link className="btn btn-ondark" href={secundario.href}>
              {secundario.titulo}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
