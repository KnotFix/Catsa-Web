"use client";

import { useState } from "react";
import type { Medio } from "../types";
import { DetalleMedio } from "./detalle-medio";
import { VistaMedio } from "./vista-medio";

/** Cuadrícula de la biblioteca. Al elegir un archivo se abre su detalle. */
export function GaleriaMedios({
  medios,
  puedeEditar,
  puedeEliminar,
}: {
  medios: Medio[];
  puedeEditar: boolean;
  puedeEliminar: boolean;
}) {
  const [abierto, setAbierto] = useState<Medio | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 movil:grid-cols-3 tablet:grid-cols-4 nav:grid-cols-6">
        {medios.map((medio) => (
          <li key={medio.id}>
            <button
              type="button"
              onClick={() => setAbierto(medio)}
              className="group w-full rounded-lg text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <VistaMedio medio={medio} className="transition-shadow group-hover:shadow-md" />
              <span className="mt-2 block truncate text-xs text-catsa-body">{medio.alt || medio.nombre}</span>
            </button>
          </li>
        ))}
      </ul>
      {abierto && (
        <DetalleMedio
          medio={abierto}
          puedeEditar={puedeEditar}
          puedeEliminar={puedeEliminar}
          onCerrar={() => setAbierto(null)}
        />
      )}
    </>
  );
}
