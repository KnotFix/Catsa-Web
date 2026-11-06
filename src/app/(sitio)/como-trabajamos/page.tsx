import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { Cierre } from "@/components/sitio/cierre";
import { ConEspacio } from "@/features/contenido/components/con-espacio";
import { espacioComoEncabezado, espacioComoCierre } from "@/features/contenido/espacios";
import { Divisor } from "@/components/sitio/costura";
import { Titular } from "@/components/sitio/titular";
import { Fases } from "@/features/sitio/components/fases";
import "./estilos.css";

export const metadata: Metadata = {
  title: "Cómo trabajamos",
  description:
    "Las siete fases de producción de CATSA, de la cosecha de la caña al envase y despacho, con trazabilidad de principio a fin.",
};

export default function ComoTrabajamosPage() {
  return (
    <div className="pg-como">
      <ConEspacio espacio={espacioComoEncabezado}>
        {(datos) => (
          <CabeceraPagina
            {...datos}
            icono={
              <>
                <circle pathLength={1} cx="5" cy="12" r="2" />
                <circle pathLength={1} cx="12" cy="12" r="2" />
                <circle pathLength={1} cx="19" cy="12" r="2" />
                <path pathLength={1} d="M7 12h3M14 12h3" />
              </>
            }
          />
        )}
      </ConEspacio>

      <section className="cw-intro">
        <div className="wrap" data-reveal>
          <p className="lead-lab">Siete fases</p>
          <Titular texto="Cada grano de azúcar recorre un proceso trazable y certificado." />
        </div>
      </section>

      <Divisor />
      <Fases />

      <ConEspacio espacio={espacioComoCierre}>
        {(datos) => (
          <Cierre
            {...datos}
            principal={{ titulo: "Ver certificaciones", href: "/certificaciones" }}
            secundario={{ titulo: "Ver productos", href: "/productos" }}
          />
        )}
      </ConEspacio>
    </div>
  );
}
