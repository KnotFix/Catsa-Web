import Link from "next/link";
import type { Route } from "next";
import { POR_PAGINA } from "@/lib/api/tipos";

/**
 * Anterior / Siguiente con enlaces normales: cada página tiene su dirección,
 * Google la puede recorrer y funciona sin JavaScript.
 */
export function Paginacion({
  total,
  pagina,
  porPagina = POR_PAGINA,
  enlace,
}: {
  total: number;
  pagina: number;
  porPagina?: number;
  enlace: (pagina: number) => Route;
}) {
  const paginas = Math.ceil(total / porPagina);
  if (paginas <= 1) return null;

  const clase = "rounded-lg border px-4 py-2 text-sm font-semibold transition-colors hover:bg-catsa-cream";
  return (
    <nav aria-label="Paginación" className="mt-10 flex items-center justify-between gap-4">
      {pagina > 1 ? (
        <Link href={enlace(pagina - 1)} className={clase} rel="prev">
          Anterior
        </Link>
      ) : (
        <span />
      )}
      <p className="text-sm text-catsa-muted">
        Página {pagina} de {paginas}
      </p>
      {pagina < paginas ? (
        <Link href={enlace(pagina + 1)} className={clase} rel="next">
          Siguiente
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

/** "3" → 3. Cualquier otra cosa → 1. */
export function leerPagina(valor: string | string[] | undefined) {
  const numero = Number(Array.isArray(valor) ? valor[0] : valor);
  return Number.isInteger(numero) && numero > 0 ? numero : 1;
}
