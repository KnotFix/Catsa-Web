import { EstadoVacio } from "@/components/shared/estado-vacio";
import { Skeleton } from "@/components/ui/skeleton";
import { listarNoticias } from "../api";
import { TarjetaNoticia } from "./tarjeta-noticia";

/** Usar dentro de <Suspense fallback={<CargandoNoticias />}>. */
export async function ListaNoticias() {
  const { results } = await listarNoticias();

  if (results.length === 0) {
    return <EstadoVacio titulo="Aún no hay noticias publicadas" />;
  }

  return (
    <div className="grid gap-6 tablet:grid-cols-3">
      {results.map((noticia) => (
        <TarjetaNoticia key={noticia.slug} noticia={noticia} />
      ))}
    </div>
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
