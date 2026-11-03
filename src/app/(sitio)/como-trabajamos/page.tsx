import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { Cierre } from "@/components/sitio/cierre";
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
      <CabeceraPagina
        antetitulo="Nuestro proceso"
        titulo="De la caña al azúcar"
        bajada="Siga el recorrido de la caña guanacasteca por cada fase de producción, hasta convertirse en azúcar y alcohol de clase mundial."
        icono={
          <>
            <circle pathLength={1} cx="5" cy="12" r="2" />
            <circle pathLength={1} cx="12" cy="12" r="2" />
            <circle pathLength={1} cx="19" cy="12" r="2" />
            <path pathLength={1} d="M7 12h3M14 12h3" />
          </>
        }
      />

      <section className="cw-intro">
        <div className="wrap" data-reveal>
          <p className="lead-lab">Siete fases</p>
          <Titular texto="Cada grano de azúcar recorre un proceso trazable y certificado." />
        </div>
      </section>

      <Divisor />
      <Fases />

      <Cierre
        antetitulo="Calidad garantizada"
        titulo="Siete fases, un mismo estándar de calidad."
        texto="Todo el recorrido opera bajo certificaciones internacionales que respaldan cada grano que producimos."
        principal={{ titulo: "Ver certificaciones", href: "/certificaciones" }}
        secundario={{ titulo: "Ver productos", href: "/productos" }}
      />
    </div>
  );
}
