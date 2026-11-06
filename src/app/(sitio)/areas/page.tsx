import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { Cierre } from "@/components/sitio/cierre";
import { ConEspacio } from "@/features/contenido/components/con-espacio";
import { espacioAreasEncabezado, espacioAreasCierre } from "@/features/contenido/espacios";
import { Titular } from "@/components/sitio/titular";
import { ExploradorAreas } from "@/features/sitio/components/explorador-areas";
import "./estilos.css";

export const metadata: Metadata = {
  title: "Nuestras áreas",
  description:
    "Administración, Agrícola, Industrial y Taller: las cuatro áreas que convierten la caña guanacasteca en azúcares y alcoholes.",
};

export default function AreasPage() {
  return (
    <div className="pg-areas">
      <ConEspacio espacio={espacioAreasEncabezado}>
        {(datos) => (
          <CabeceraPagina
            {...datos}
            icono={
              <>
                <rect pathLength={1} x="4" y="4" width="7" height="7" rx="1.5" />
                <rect pathLength={1} x="13" y="4" width="7" height="7" rx="1.5" />
                <rect pathLength={1} x="4" y="13" width="7" height="7" rx="1.5" />
                <rect pathLength={1} x="13" y="13" width="7" height="7" rx="1.5" />
              </>
            }
          />
        )}
      </ConEspacio>

      <section className="ct-intro">
        <div className="wrap" data-reveal>
          <p className="lead-lab">Las cuatro áreas</p>
          <Titular texto="Cada grano de azúcar es el trabajo coordinado de todas nuestras áreas." />
        </div>
      </section>

      <section className="ar-sec">
        <div className="wrap">
          <ExploradorAreas />
        </div>
      </section>

      <ConEspacio espacio={espacioAreasCierre}>
        {(datos) => (
          <Cierre
            {...datos}
            principal={{ titulo: "Vea cómo trabajamos", href: "/como-trabajamos" }}
            secundario={{ titulo: "Únase al equipo", href: "/puestos" }}
          />
        )}
      </ConEspacio>
    </div>
  );
}
