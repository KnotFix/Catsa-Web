import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { Cierre } from "@/components/sitio/cierre";
import { Titular } from "@/components/sitio/titular";
import { fondo, fotos } from "@/features/sitio/imagenes";
import { cn } from "@/lib/utils";
import "./estilos.css";

export const metadata: Metadata = {
  title: "RSE",
  description:
    "Salud, educación, desarrollo comunal y reforestación: los cuatro puentes que conectan a CATSA con las comunidades de Guanacaste.",
};

const PUENTES = [
  {
    programa: "Programa de Salud",
    titulo: "Puente al bienestar",
    texto:
      "Apoyamos iniciativas comunitarias de bienestar y salud de la población, acercando servicios y recursos a las comunidades cercanas a nuestra operación.",
    foto: fotos.comunidad.src,
  },
  {
    programa: "Programa de Educación",
    titulo: "Puente al futuro",
    texto:
      "Contribuimos a la formación de las nuevas generaciones guanacastecas, apoyando la educación como motor de desarrollo de la región.",
    foto: fotos.planta.src,
  },
  {
    programa: "Desarrollo Comunal",
    titulo: "Por el bienestar de la comunidad",
    texto:
      "Facilitamos proyectos de infraestructura, cultura y valores guanacastecos, fortaleciendo el tejido social de las comunidades vecinas.",
    foto: fotos.operacion.src,
  },
  {
    programa: "Reforestación y Voluntariado",
    titulo: "Puentes de unión",
    texto:
      "Perpetuamos los árboles en los linderos del río y las comunidades cercanas, con jornadas de reforestación y voluntariado de nuestros colaboradores.",
    foto: fotos.canales.src,
  },
];

export default function RsePage() {
  return (
    <div className="pg-rse">
      <CabeceraPagina
        antetitulo="Responsabilidad social empresarial"
        titulo="Sembramos comunidad."
        bajada="Nuestro compromiso trasciende la producción: construimos puentes hacia las comunidades de Guanacaste."
        icono={
          <path
            pathLength={1}
            d="M12 20s-6.6-4.1-6.6-9.1A3.6 3.6 0 0 1 12 8.4a3.6 3.6 0 0 1 6.6 2.5c0 5-6.6 9.1-6.6 9.1z"
          />
        }
      />

      <section className="intro-line">
        <div className="wrap" data-reveal>
          <p className="lead-lab text-center">Cuatro puentes</p>
          <Titular texto="Programas que conectan a CATSA con el bienestar de la región chorotega." />
        </div>
      </section>

      <section className="puentes">
        {PUENTES.map((p, i) => (
          <div key={p.titulo} className={cn("pz", i % 2 === 1 && "flip")}>
            <div className="pz-visual">
              <div className="pz-img" data-px="54" style={fondo(p.foto)} />
              <div className="gh" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
            <div className="pz-text" data-reveal>
              <span className="tag">{p.programa}</span>
              <Titular como="h3" texto={p.titulo} />
              <p>{p.texto}</p>
            </div>
          </div>
        ))}
      </section>

      <Cierre
        antetitulo="Nuestro compromiso"
        titulo="Cada grano de azúcar deja algo en Guanacaste."
        texto="Así retribuimos a la tierra y a la gente que hacen posible a CATSA. ¿Tiene una iniciativa para la comunidad?"
        principal={{ titulo: "Escríbanos", href: "/contacto" }}
        secundario={{ titulo: "Conozca CATSA", href: "/sobre-nosotros" }}
      />
    </div>
  );
}
