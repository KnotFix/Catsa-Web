import type { ReactNode } from "react";
import { Contenedor } from "./contenedor";

/** Bloque de página pública con antetítulo y título, como en la demo. */
export function SeccionSitio({
  antetitulo,
  titulo,
  children,
}: {
  antetitulo?: string;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section className="py-16 tablet:py-24">
      <Contenedor>
        {antetitulo && (
          <p className="text-xs font-semibold tracking-[0.16em] text-catsa-green uppercase">{antetitulo}</p>
        )}
        <h1 className="mt-3 text-3xl text-catsa-ink tablet:text-4xl">{titulo}</h1>
        <div className="mt-10">{children}</div>
      </Contenedor>
    </section>
  );
}
