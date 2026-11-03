import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { Costura } from "./costura";
import { PorPalabras } from "./titular";

/**
 * Encabezado de las páginas interiores (.ph del boceto): antetítulo, título
 * que entra palabra por palabra, bajada y, a la derecha, el disco en relieve
 * con el icono del tema dibujándose. Todo con CSS: no espera a JavaScript.
 *
 * `icono` son los trazos de un SVG de 24×24, cada uno con pathLength={1} para
 * que se dibujen con el mismo dasharray.
 */
export function CabeceraPagina({
  antetitulo,
  titulo,
  bajada,
  icono,
  miga,
  children,
}: {
  antetitulo: string;
  titulo: string;
  bajada?: string;
  icono: ReactNode;
  miga?: { titulo: string; href?: Route }[];
  /** Lo que va bajo la bajada (código de producto, botones…). Entra después. */
  children?: ReactNode;
}) {
  // La bajada entra cuando el título va terminando de subir.
  const palabras = titulo.trim().split(/\s+/).length;
  const despues = Math.min(0.28 + palabras * 0.045, 0.8);

  return (
    <section className="ph ph-fx">
      <div className="ph-in">
        <div className="ph-copy">
          {miga && (
            <nav className="ph-crumb fx" style={retardo(0.06)} aria-label="Miga de pan">
              {miga.map((m, i) => (
                <span key={m.titulo} className="contents">
                  {i > 0 && (
                    <span className="sep" aria-hidden>
                      ›
                    </span>
                  )}
                  {m.href ? (
                    <Link href={m.href}>{m.titulo}</Link>
                  ) : (
                    <span aria-current="page">{m.titulo}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <p className="eyebrow fx" style={retardo(0.12)}>
            {antetitulo}
          </p>
          <h1>
            <PorPalabras texto={titulo} />
          </h1>
          {bajada && (
            <p className="sub fx" style={retardo(despues)}>
              {bajada}
            </p>
          )}
          {children && (
            <div className="fx" style={retardo(despues + 0.08)}>
              {children}
            </div>
          )}
          <div className="rule" />
        </div>
        <div className="ph-art" aria-hidden>
          <div className="ph-disc">
            <svg className="ph-art-ico" viewBox="0 0 24 24">
              {icono}
            </svg>
          </div>
        </div>
      </div>
      <Costura />
    </section>
  );
}

const retardo = (s: number) => ({ "--d": `${s.toFixed(2)}s` }) as React.CSSProperties;
