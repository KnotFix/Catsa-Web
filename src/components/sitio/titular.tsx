import { Fragment, type JSX } from "react";
import { cn } from "@/lib/utils";

/**
 * Una caja por palabra: cada una sube desde detrás de su caja (.w); el <i>
 * solo lleva el movimiento. Con `paso`, cada palabra arranca un poco después.
 * Sin `paso`, el retardo lo pone el CSS (el h1 del encabezado).
 */
export function PorPalabras({
  texto,
  retardo = 0,
  paso,
}: {
  texto: string;
  retardo?: number;
  paso?: number;
}) {
  return texto
    .trim()
    .split(/\s+/)
    .map((palabra, i) => (
      <Fragment key={i}>
        <span className="w">
          <i
            style={
              paso === undefined ? undefined : ({ "--d": `${retardo + i * paso}ms` } as React.CSSProperties)
            }
          >
            {palabra}
          </i>
        </span>{" "}
      </Fragment>
    ));
}

/**
 * Titular que entra palabra por palabra al aparecer en pantalla (.words del
 * boceto). Se parte en el servidor; <Movimiento> le pone .on. `retardo`
 * escalona grupos (las cuatro cifras, los cinco valores) en milisegundos. El
 * lector de pantalla lee la frase entera, no palabra por palabra.
 */
export function Titular({
  como: Etiqueta = "h2",
  texto,
  retardo,
  className,
}: {
  como?: keyof JSX.IntrinsicElements;
  texto: string;
  retardo?: number;
  className?: string;
}) {
  return (
    <Etiqueta className={cn("words", className)}>
      <span className="sr-only">{texto}</span>
      <span aria-hidden>
        <PorPalabras texto={texto} retardo={retardo} paso={55} />
      </span>
    </Etiqueta>
  );
}
