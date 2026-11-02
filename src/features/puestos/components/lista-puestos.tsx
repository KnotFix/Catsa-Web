import Link from "next/link";
import { EstadoVacio } from "@/components/shared/estado-vacio";
import { Badge } from "@/components/ui/badge";
import { formatearFecha } from "@/lib/formato";
import { listarPuestos } from "../api";

export async function ListaPuestos() {
  const { results } = await listarPuestos();

  if (results.length === 0) {
    return (
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
            className="flex flex-col gap-2 p-5 transition-colors hover:bg-catsa-cream movil:flex-row movil:items-center movil:justify-between"
          >
            <div>
              <h3 className="text-lg text-catsa-ink">{puesto.titulo}</h3>
              <p className="text-sm text-catsa-muted">
                {puesto.area} · {puesto.ubicacion}
              </p>
            </div>
            {puesto.cierra_el && (
              <Badge variant="secondary">Cierra el {formatearFecha(puesto.cierra_el)}</Badge>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
