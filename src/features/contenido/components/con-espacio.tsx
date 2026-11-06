import { Suspense, type ReactNode } from "react";
import { obtenerEspacio } from "../api";
import type { Espacio } from "../espacios";

/**
 * Pinta una pieza del sitio con el contenido de un espacio editable. Mientras
 * llega, o si la API no responde, se ve el texto del diseño: la página nunca
 * queda en blanco. Con la API arriba, el texto está en caché y ya sale en el
 * HTML estático.
 */
export function ConEspacio<T>({
  espacio,
  children,
}: {
  espacio: Espacio<T>;
  children: (datos: T) => ReactNode;
}) {
  return (
    <Suspense fallback={children(espacio.porDefecto)}>
      <Leer espacio={espacio}>{children}</Leer>
    </Suspense>
  );
}

async function Leer<T>({ espacio, children }: { espacio: Espacio<T>; children: (datos: T) => ReactNode }) {
  return children(await obtenerEspacio(espacio));
}
