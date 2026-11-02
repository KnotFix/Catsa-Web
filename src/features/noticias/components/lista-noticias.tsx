import type { Route } from "next";
import { EstadoVacio } from "@/components/shared/estado-vacio";
import { Paginacion } from "@/components/shared/paginacion";
import { Skeleton } from "@/components/ui/skeleton";
import { listarNoticias } from "../api";
import { TarjetaNoticia } from "./tarjeta-noticia";

/**
 * Usar dentro de <Suspense fallback={<CargandoNoticias />}>. `limite` corta la
 * lista sin paginación (portada); sin él, se pagina con `pagina`.
 */
export async function ListaNoticias({
  pagina = 1,
  categoria,
  limite,
}: {
  pagina?: number;
  categoria?: string;
  limite?: number;
}) {
  const { count, results } = await listarNoticias({ pagina, categoria });
  const noticias = limite ? results.slice(0, limite) : results;

  if (noticias.length === 0) {
    return <EstadoVacio titulo="Aún no hay noticias publicadas" />;
  }

  return (
    <>
      <div className="grid gap-6 tablet:grid-cols-3">
        {noticias.map((noticia) => (
          <TarjetaNoticia key={noticia.slug} noticia={noticia} />
        ))}
      </div>
      {!limite && (
        <Paginacion
          total={count}
          pagina={pagina}
          enlace={(p) => {
            const consulta = new URLSearchParams({
              ...(categoria && { categoria }),
              ...(p > 1 && { pagina: String(p) }),
            });
            return `/noticias${consulta.size ? `?${consulta}` : ""}` as Route;
          }}
        />
      )}
    </>
  );
}

export function CargandoNoticias() {
  return (
    <div className="grid gap-6 tablet:grid-cols-3">
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
      ))}
    </div>
  );
}
