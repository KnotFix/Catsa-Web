import type { CSSProperties, ReactNode } from "react";

export type Cifra = {
  etiqueta: string;
  valor: number;
  unidad?: string;
  /** Lo que se lee bajo el número. */
  detalle: string;
  /** Una línea más de contexto: reemplaza al detalle al pasar el puntero o enfocar. */
  contexto?: string;
  /** Dibujo de trazo (viewBox 0 0 120 48) que se traza al entrar. Cada trazo con pathLength={1}. */
  dibujo?: ReactNode;
};

const miles = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/**
 * Banda de cifras: un encabezado y tres o cuatro números en una cuadrícula con
 * líneas finas. Al entrar en pantalla (lo pone <Movimiento>), cada número sube
 * desde cero uno detrás de otro y su dibujo se traza debajo. El valor final
 * reserva el ancho, así que nada se mueve mientras cambian los dígitos, y los
 * lectores de pantalla solo oyen el valor final.
 */
export function BandaCifras({
  titulo,
  descripcion,
  cifras,
}: {
  titulo: string;
  descripcion?: string;
  cifras: Cifra[];
}) {
  return (
    <div className="bc" data-reveal>
      <header className="bc-cabeza">
        <h3 className="bc-titulo">{titulo}</h3>
        {descripcion && <p className="bc-desc">{descripcion}</p>}
      </header>
      <dl className="bc-lista" style={{ "--n": Math.min(cifras.length, 4) } as CSSProperties}>
        {cifras.map((c, i) => (
          <div
            key={c.etiqueta}
            className="bc-cifra"
            style={{ "--i": i } as CSSProperties}
            tabIndex={c.contexto ? 0 : undefined}
          >
            <dt className="bc-etiqueta">{c.etiqueta}</dt>
            <dd className="bc-figura">
              <span className="sr-only">
                {miles(c.valor)} {c.unidad}
              </span>
              <span className="bc-numero" aria-hidden>
                <span className="bc-digitos">
                  <span className="bc-medida">{miles(c.valor)}</span>
                  <span className="bc-vivo" data-count={c.valor}>
                    {miles(c.valor)}
                  </span>
                </span>
                {c.unidad && <span className="bc-unidad">{c.unidad}</span>}
              </span>
            </dd>
            <dd className="bc-pie">
              <span className="bc-detalle">{c.detalle}</span>
              {c.contexto && <span className="bc-contexto">{c.contexto}</span>}
            </dd>
            {c.dibujo && (
              <dd className="bc-dibujo" aria-hidden>
                <svg
                  viewBox="0 0 120 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {c.dibujo}
                </svg>
              </dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}
