import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { Cierre } from "@/components/sitio/cierre";
import { Titular } from "@/components/sitio/titular";
import { LineaTiempo, type Hito } from "@/features/sitio/components/linea-tiempo";
import { fondo, fotos } from "@/features/sitio/imagenes";
import "./estilos.css";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "CATSA, Central Azucarera Tempisque: 50 años cultivando y procesando caña en Guanacaste, con más de 450 colaboradores permanentes.",
};

const CIFRAS = [
  { valor: "14.500", texto: "Bultos de 50 kg de azúcar al día" },
  { valor: "250.000 L", texto: "De alcohol anhidro al día" },
  { valor: "10.551 ha", texto: "Propias, más ~400 productores" },
  { valor: "450+", texto: "Colaboradores permanentes" },
];

const HITOS: Hito[] = [
  {
    anio: "1975",
    antetitulo: "El origen",
    titulo: "Se funda CATSA en Guardia de Liberia",
    texto:
      "Nace como subsidiaria de CODESA (fundada en 1972) bajo un esquema de capital mixto, con la visión de industrializar la caña en el corazón de Guanacaste.",
    foto: fotos.comunidad.src,
  },
  {
    anio: "1984–89",
    antetitulo: "Transición",
    titulo: "Cambio de manos y consolidación",
    texto:
      "La Ley 6955 permite la venta de las acciones de las subsidiarias de CODESA. CATSA pasa a FINTRA y luego, en 1989, al Sector Cooperativo Nacional.",
    foto: fotos.planta.src,
  },
  {
    anio: "1997",
    antetitulo: "Crecimiento",
    titulo: "Inversión de capital privado centroamericano",
    texto:
      "CATSA pasa a ser parte de un grupo de capital privado centroamericano, con importante inversión en la empresa, sus colaboradores y las comunidades cercanas.",
    foto: fotos.industrial.src,
  },
  {
    anio: "Hoy",
    antetitulo: "Presente",
    titulo: "Calidad certificada internacionalmente",
    texto:
      "Operamos bajo ISO 9001, FSSC 22000, Kosher, ISCC y Esencial Costa Rica, exportando azúcares y alcoholes con estándares de clase mundial.",
    foto: fotos.operacion.src,
  },
];

const VALORES = [
  { nombre: "Respeto", texto: "Consideración y atención en las relaciones con los compañeros." },
  { nombre: "Innovación", texto: "Buscamos permanentemente nuevas formas de resolver y crear valor." },
  {
    nombre: "Responsabilidad",
    texto: "Asumimos compromisos y los llevamos a cabo con diligencia y entrega.",
  },
  { nombre: "Excelencia", texto: "Aspiramos a los mejores resultados, con eficiencia, desde el principio." },
  { nombre: "Orden", texto: "Planificamos adecuadamente nuestras acciones y el uso de los recursos." },
];

export default function SobreNosotrosPage() {
  return (
    <div className="pg-sobre">
      <CabeceraPagina
        antetitulo="Quiénes somos"
        titulo="Una empresa con raíces en Guanacaste desde 1975."
        bajada="Cultivamos, procesamos y transformamos la caña de azúcar en productos que llevan el nombre de Guanacaste al mundo."
        icono={
          <>
            <path pathLength={1} d="M4 20h16" />
            <path pathLength={1} d="M6 20V9l6-4 6 4v11" />
            <path pathLength={1} d="M10 20v-5h4v5" />
          </>
        }
      />

      <section className="sn-lead">
        <div className="wrap grid">
          <Titular texto="Cultivamos, procesamos y transformamos la caña guanacasteca." />
          <div>
            <p data-reveal>
              Central Azucarera Tempisque (CATSA) está localizada en Guardia de Liberia. Cultivamos y
              procesamos caña de azúcar y producimos azúcares y alcoholes para el mercado nacional y de
              exportación.
            </p>
            <p data-reveal>
              Somos una de las principales fuentes de empleo de la zona: más de 450 colaboradores permanentes
              y, en zafra, más de 1.000 personas.
            </p>
            <div className="metrics">
              {CIFRAS.map((c, i) => (
                <div key={c.texto} className="metric" data-reveal>
                  <Titular como="div" className="n" texto={c.valor} retardo={60 * (i + 1)} />
                  <div className="l">{c.texto}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="hist">
        <div className="hist-head">
          <p className="eyebrow" data-reveal>
            Nuestra historia
          </p>
          <Titular texto="Creada para impulsar el desarrollo de Guanacaste" />
        </div>
        <LineaTiempo hitos={HITOS} />
      </section>

      <section className="mv">
        <div className="mbg" data-px="70" style={fondo(fotos.planta.src)} />
        <div className="wrap">
          <div className="grid">
            <div className="card" data-reveal>
              <div className="lab">Misión</div>
              <Titular
                como="p"
                retardo={120}
                texto="Somos una empresa agroindustrial que transforma la caña de azúcar de manera sostenible, en productos que generan bienestar a las partes interesadas."
              />
            </div>
            <div className="card" data-reveal>
              <div className="lab">Visión</div>
              <Titular
                como="p"
                retardo={180}
                texto="Seremos la empresa líder en productividad y rentabilidad de la agroindustria azucarera nacional."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="vals">
        <div className="wrap">
          <div className="sec-top">
            <div className="eyebrow" data-reveal>
              Lo que nos guía
            </div>
            <Titular texto="Nuestros valores" />
          </div>
          <div className="vgrid">
            {VALORES.map((v, i) => (
              <div key={v.nombre} className="vitem" data-reveal>
                <div className="vn">{String(i + 1).padStart(2, "0")}</div>
                <Titular como="h3" texto={v.nombre} retardo={60 * (i + 1)} />
                <p>{v.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Cierre
        antetitulo="Trabajá con nosotros"
        titulo="Sé parte de la historia de CATSA."
        texto="Somos una de las principales fuentes de empleo de Guanacaste. Conocé nuestras oportunidades laborales."
        principal={{ titulo: "Ver puestos disponibles", href: "/puestos" }}
        secundario={{ titulo: "Escribinos", href: "/contacto" }}
      />
    </div>
  );
}
