import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { Cierre } from "@/components/sitio/cierre";
import { ExploradorProductos } from "@/features/sitio/components/explorador-productos";
import { openGraphSitio } from "@/features/contenido/ajustes";
import { fotos } from "@/features/sitio/imagenes";
import "./estilos.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Productos",
    description:
      "Catálogo de CATSA: azúcar crudo, blanco, refinado, alcohol etílico neutro y miel de caña, con ficha técnica y certificaciones.",
    openGraph: await openGraphSitio({ images: [{ url: fotos.azucar.src, alt: fotos.azucar.alt }] }),
  };
}

export default function ProductosPage() {
  return (
    <div className="pg-productos">
      <CabeceraPagina
        antetitulo="Productos"
        titulo="Azúcares, alcoholes y miel para el mercado nacional y de exportación."
        bajada="Certificados bajo ISO 9001, FSSC 22000, Kosher, ISCC y Esencial Costa Rica. Explore cada producto y su ficha técnica sin salir de la página."
        icono={
          <>
            <path pathLength={1} d="M3 8l9-5 9 5v8l-9 5-9-5V8z" />
            <path pathLength={1} d="M3 8l9 5 9-5" />
            <path pathLength={1} d="M12 13v8" />
          </>
        }
      />

      <section>
        <div className="wrap">
          <ExploradorProductos />
        </div>
      </section>

      <Cierre
        antetitulo="Cotizaciones"
        titulo="¿Necesita azúcar, alcohol o miel para su operación?"
        texto="Solicite la ficha técnica de cualquier producto o una cotización a la medida de su industria."
        principal={{ titulo: "Solicitar cotización", href: "/contacto" }}
        secundario={{ titulo: "Ver certificaciones", href: "/certificaciones" }}
      />
    </div>
  );
}
