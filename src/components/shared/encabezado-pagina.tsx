import type { ReactNode } from "react";

/** Título de cada página del panel, con acciones a la derecha (por ejemplo "Nueva noticia"). */
export function EncabezadoPagina({
  titulo,
  descripcion,
  acciones,
}: {
  titulo: string;
  descripcion?: string;
  acciones?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl text-catsa-ink">{titulo}</h1>
        {descripcion && <p className="mt-1 text-catsa-muted">{descripcion}</p>}
      </div>
      {acciones}
    </header>
  );
}
