import { Suspense } from "react";
import type { Metadata } from "next";
import { leerPagina } from "@/components/shared/paginacion";
import { SeccionSitio } from "@/components/shared/seccion-sitio";
import { FiltroCategorias } from "@/features/noticias/components/filtro-categorias";
import { CargandoNoticias, ListaNoticias } from "@/features/noticias/components/lista-noticias";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Noticias y comunicados de CATSA.",
};

export default function NoticiasPage({ searchParams }: PageProps<"/noticias">) {
  return (
    <SeccionSitio antetitulo="Sala de prensa" titulo="Noticias">
      <Suspense fallback={<CargandoNoticias />}>
        <Listado searchParams={searchParams} />
      </Suspense>
    </SeccionSitio>
  );
}

// La consulta (?categoria=, ?pagina=) se conoce en la petición; las lecturas
// a las que se le pasa están en caché, así que el costo es mínimo.
async function Listado({ searchParams }: Pick<PageProps<"/noticias">, "searchParams">) {
  const { categoria, pagina } = await searchParams;
  const slug = typeof categoria === "string" ? categoria : undefined;
  return (
    <>
      <FiltroCategorias activa={slug} />
      <ListaNoticias categoria={slug} pagina={leerPagina(pagina)} />
    </>
  );
}
