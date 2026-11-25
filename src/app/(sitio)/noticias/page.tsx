import { Suspense } from "react";
import type { Metadata } from "next";
import { leerPagina } from "@/components/shared/paginacion";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { ConEspacio } from "@/features/contenido/components/con-espacio";
import { espacioNoticiasEncabezado } from "@/features/contenido/espacios";
import { FiltroCategorias } from "@/features/noticias/components/filtro-categorias";
import { CargandoNoticias, ListaNoticias } from "@/features/noticias/components/lista-noticias";

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Noticias y comunicados de CATSA: la zafra, la planta, las certificaciones y el trabajo con las comunidades de Guanacaste.",
  alternates: { canonical: "/noticias" },
};

export default function NoticiasPage({ searchParams }: PageProps<"/noticias">) {
  return (
    <>
      <ConEspacio espacio={espacioNoticiasEncabezado}>
        {(datos) => (
          <CabeceraPagina
            {...datos}
            icono={
              <>
                <path pathLength={1} d="M4 5h16v14H4z" />
                <path pathLength={1} d="M8 9h8M8 13h5" />
              </>
            }
          />
        )}
      </ConEspacio>
      <section className="pb-24">
        <div className="wrap">
          {/* Las tarjetas son h3: sin este h2 el lector de pantalla salta del h1 al h3. */}
          <h2 className="sr-only">Noticias publicadas</h2>
          <Suspense fallback={<CargandoNoticias />}>
            <Listado searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
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
