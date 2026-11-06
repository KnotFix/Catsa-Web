import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { Cierre } from "@/components/sitio/cierre";
import { ConEspacio } from "@/features/contenido/components/con-espacio";
import { espacioProductosEncabezado, espacioProductosCierre } from "@/features/contenido/espacios";
import { ExploradorProductos } from "@/features/sitio/components/explorador-productos";
import { openGraphSitio } from "@/features/contenido/ajustes";
import { fotos } from "@/features/sitio/imagenes";
import "./estilos.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Productos",
    description:
      "Catálogo de CATSA: azúcar crudo, blanco, especial y refino, alcohol etílico neutro y anhidro, miel y arroz, con la ficha técnica de cada producto.",
    openGraph: await openGraphSitio({
      images: [{ url: fotos.refinadoNacional.src, alt: fotos.refinadoNacional.alt }],
    }),
  };
}

export default function ProductosPage() {
  return (
    <div className="pg-productos">
      <ConEspacio espacio={espacioProductosEncabezado}>
        {(datos) => (
          <CabeceraPagina
            {...datos}
            icono={
              <>
                <path pathLength={1} d="M3 8l9-5 9 5v8l-9 5-9-5V8z" />
                <path pathLength={1} d="M3 8l9 5 9-5" />
                <path pathLength={1} d="M12 13v8" />
              </>
            }
          />
        )}
      </ConEspacio>

      <section>
        <div className="wrap">
          <ExploradorProductos />
        </div>
      </section>

      <ConEspacio espacio={espacioProductosCierre}>
        {(datos) => (
          <Cierre
            {...datos}
            principal={{ titulo: "Solicitar cotización", href: "/contacto" }}
            secundario={{ titulo: "Ver certificaciones", href: "/certificaciones" }}
          />
        )}
      </ConEspacio>
    </div>
  );
}
