import type { ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";
import { obtenerFiltros } from "../api";
import type { FiltrosElegidos } from "../types";

/**
 * Filtros por área y ubicación (alcance de la bitácora). Son enlaces, no un
 * formulario: cada combinación tiene su dirección y funciona sin JavaScript.
 * Solo aparecen opciones con algún puesto abierto.
 */
export async function FiltrosPuestos({ elegidos }: { elegidos: FiltrosElegidos }) {
  const { areas, ubicaciones } = await obtenerFiltros();
  if (areas.length + ubicaciones.length <= 2) return null;

  const enlace = (cambio: FiltrosElegidos): Route => {
    const consulta = new URLSearchParams(
      Object.entries({ ...elegidos, ...cambio }).filter((par): par is [string, string] => Boolean(par[1])),
    );
    return `/puestos${consulta.size ? `?${consulta}` : ""}` as Route;
  };

  return (
    <div className="mb-8 grid gap-4">
      <Grupo titulo="Área">
        <Opcion href={enlace({ area: undefined })} activa={!elegidos.area}>
          Todas
        </Opcion>
        {areas.map((area) => (
          <Opcion key={area.slug} href={enlace({ area: area.slug })} activa={elegidos.area === area.slug}>
            {area.nombre}
          </Opcion>
        ))}
      </Grupo>
      <Grupo titulo="Ubicación">
        <Opcion href={enlace({ ubicacion: undefined })} activa={!elegidos.ubicacion}>
          Todas
        </Opcion>
        {ubicaciones.map((ubicacion) => (
          <Opcion
            key={ubicacion}
            href={enlace({ ubicacion })}
            activa={elegidos.ubicacion?.toLowerCase() === ubicacion.toLowerCase()}
          >
            {ubicacion}
          </Opcion>
        ))}
      </Grupo>
    </div>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <nav aria-label={titulo} className="flex flex-wrap items-center gap-2">
      <span className="mr-1 w-20 text-sm font-semibold text-catsa-muted">{titulo}</span>
      {children}
    </nav>
  );
}

function Opcion({ href, activa, children }: { href: Route; activa: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={activa ? "page" : undefined}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
        activa ? "bg-catsa-ink text-white" : "bg-catsa-cream text-catsa-body hover:bg-catsa-cream-2",
      )}
    >
      {children}
    </Link>
  );
}
