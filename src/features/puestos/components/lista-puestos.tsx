import Link from "next/link";
import { EstadoVacio } from "@/components/shared/estado-vacio";
import { Etiqueta } from "@/components/shared/etiqueta";
import { formatearFecha } from "@/lib/formato";
import { listarPuestos } from "../api";
import type { FiltrosElegidos } from "../types";

export async function ListaPuestos({ filtros = {} }: { filtros?: FiltrosElegidos }) {
  const { results } = await listarPuestos(filtros);
  const filtrado = Boolean(filtros.area || filtros.ubicacion);

  if (results.length === 0) {
    return filtrado ? (
      <EstadoVacio titulo="No hay puestos con esos filtros" descripcion="Pruebe con otra área o ubicación." />
    ) : (
      <EstadoVacio
        titulo="No hay puestos abiertos en este momento"
        descripcion="Vuelva pronto: aquí publicamos cada vacante de CATSA."
      />
    );
  }

  return (
    <ul className="divide-y rounded-xl border bg-card">
      {results.map((puesto) => (
        <li key={puesto.slug}>
          <Link
            href={`/puestos/${puesto.slug}`}
            className="flex flex-col gap-3 p-5 transition-colors hover:bg-catsa-cream movil:flex-row movil:items-center movil:justify-between"
          >
            <div>
              <Etiqueta color={puesto.area.color}>{puesto.area.nombre}</Etiqueta>
              <h3 className="mt-2 text-lg text-catsa-ink">{puesto.titulo}</h3>
              <p className="text-sm text-catsa-muted">
                {puesto.ubicacion} · {puesto.tipo_contrato}
              </p>
            </div>
            {puesto.cierra_el && (
              <p className="shrink-0 text-sm text-catsa-brown">
                Cierra el {formatearFecha(puesto.cierra_el)}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
