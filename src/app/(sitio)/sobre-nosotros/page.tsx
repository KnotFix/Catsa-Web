import type { Metadata } from "next";
import Image from "next/image";
import { BandaCifras, type Cifra } from "@/components/sitio/banda-cifras";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { Cierre } from "@/components/sitio/cierre";
import { ConEspacio } from "@/features/contenido/components/con-espacio";
import {
  espacioSobreCierre,
  espacioSobreEncabezado,
  espacioSobreMisionVision,
} from "@/features/contenido/espacios";
import { Titular } from "@/components/sitio/titular";
import { LineaTiempo, type Hito } from "@/features/sitio/components/linea-tiempo";
import { fondo, fotos } from "@/features/sitio/imagenes";
import "./estilos.css";

export const metadata: Metadata = {
  title: "Sobre nosotros",
  description:
    "CATSA, Central Azucarera Tempisque: desde 1975 cultivando y procesando caña en Guardia de Liberia, Guanacaste, con más de 450 colaboradores permanentes.",
};

// CATSA en cifras, en dos partes: la gente y el recorrido de la caña en un
// día de zafra, en orden. Suben desde cero al aparecer
// ([data-count], en <Movimiento>).
const GENTE = [
  { valor: 450, sufijo: "+", texto: "colaboradores permanentes" },
  { valor: 1000, sufijo: "+", texto: "personas más se suman en zafra" },
];

// Un día de zafra, del campo a la destilería. Cada cifra lleva un dibujo de
// trazo (120×48) que se traza al entrar; el contexto sale de lo publicado en
// catsa.net y reemplaza al detalle al pasar el puntero.
const caña = (x: number, alto: number) => (
  <g key={x}>
    <path pathLength={1} d={`M${x} 44V${44 - alto}`} />
    <path pathLength={1} d={`M${x - 3} ${44 - alto * 0.35}h6M${x - 3} ${44 - alto * 0.7}h6`} />
    <path pathLength={1} d={`M${x} ${44 - alto * 0.85}c5-1 9-4 11-9`} />
  </g>
);

const RECORRIDO: Cifra[] = [
  {
    etiqueta: "Campo",
    valor: 10551,
    unidad: "ha",
    detalle: "de caña propia",
    contexto: "Más la caña de unos 400 productores independientes.",
    dibujo: (
      <>
        <path pathLength={1} d="M4 44h112" />
        {[
          [12, 26],
          [28, 34],
          [44, 22],
          [60, 36],
          [76, 28],
          [92, 32],
          [106, 20],
        ].map(([x, alto]) => caña(x, alto))}
      </>
    ),
  },
  {
    etiqueta: "Molienda",
    valor: 7500,
    unidad: "t",
    detalle: "de caña molida cada día",
    contexto: "Molino, refinería y destilería en Guardia de Liberia.",
    dibujo: (
      <>
        <path pathLength={1} d="M4 22h40" />
        <path pathLength={1} d="M10 22l4-6M22 22l4-6M34 22l4-6" />
        <circle pathLength={1} cx="58" cy="16" r="9" />
        <circle pathLength={1} cx="78" cy="16" r="9" />
        <circle pathLength={1} cx="68" cy="34" r="9" />
        <path pathLength={1} d="M88 34h28" />
        <path pathLength={1} d="M98 40v4M108 40v4" />
      </>
    ),
  },
  {
    etiqueta: "Azúcar",
    valor: 14500,
    unidad: "bultos",
    detalle: "de 50 kg al día",
    contexto: "El azúcar se comercializa por medio de LAICA.",
    dibujo: (
      <>
        <path pathLength={1} d="M4 44h112" />
        <path pathLength={1} d="M30 44l2-14h18l2 14" />
        <path pathLength={1} d="M52 44l2-14h18l2 14" />
        <path pathLength={1} d="M74 44l2-14h18l2 14" />
        <path pathLength={1} d="M41 30l2-14h18l2 14" />
        <path pathLength={1} d="M63 30l2-14h18l2 14" />
        <path pathLength={1} d="M52 16l2-12h18l2 12" />
      </>
    ),
  },
  {
    etiqueta: "Destilería",
    valor: 250000,
    unidad: "L",
    detalle: "de alcohol al día",
    contexto: "Alcohol etílico neutro y anhidro, despachado a granel.",
    dibujo: (
      <>
        <path pathLength={1} d="M4 44h112" />
        <path pathLength={1} d="M20 44V8h14v36" />
        <path pathLength={1} d="M20 18h14M20 28h14" />
        <path pathLength={1} d="M34 12h30v10" />
        <path pathLength={1} d="M64 28c-2 3-3 5-3 6.5a3 3 0 0 0 6 0c0-1.5-1-3.5-3-6.5z" />
        <path pathLength={1} d="M56 44V38h52v6" />
        <path pathLength={1} d="M80 38v-6h28v6" />
      </>
    ),
  },
];

const miles = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const HITOS: Hito[] = [
  {
    anio: "1975",
    antetitulo: "El origen",
    titulo: "Se funda CATSA en Guardia de Liberia",
    texto:
      "Nace como subsidiaria de CODESA, empresa gubernamental fundada en 1972 bajo un esquema de capital mixto con características de sociedad anónima.",
    foto: fotos.rotulo.src,
  },
  {
    anio: "1984–89",
    antetitulo: "Transición",
    titulo: "Cambio de manos y consolidación",
    texto:
      "En 1984 la Ley 6955 permite vender las acciones de las subsidiarias de CODESA. En 1987 CATSA pasa a FINTRA y en 1989 sus acciones las adquiere el Sector Cooperativo Nacional.",
    foto: fotos.plantaAerea.src,
  },
  {
    anio: "1997",
    antetitulo: "Crecimiento",
    titulo: "Inversión de capital privado centroamericano",
    texto:
      "CATSA pasa a ser parte de un grupo de capital privado centroamericano, con importante inversión en la empresa, sus colaboradores y las comunidades cercanas.",
    foto: fotos.destileria.src,
  },
  {
    anio: "Hoy",
    antetitulo: "Presente",
    titulo: "Más de 450 colaboradores y calidad certificada",
    texto:
      "Procesamos la caña de 10.551 hectáreas propias y de unos 400 productores independientes, bajo ISO 9001, FSSC 22000, Kosher, ISCC y Esencial Costa Rica.",
    foto: fotos.equipo.src,
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
      <ConEspacio espacio={espacioSobreEncabezado}>
        {(datos) => (
          <CabeceraPagina
            {...datos}
            icono={
              <>
                <path pathLength={1} d="M4 20h16" />
                <path pathLength={1} d="M6 20V9l6-4 6 4v11" />
                <path pathLength={1} d="M10 20v-5h4v5" />
              </>
            }
          />
        )}
      </ConEspacio>

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
              y, en zafra, más de 1.000 personas. Junto a instituciones públicas, empresas privadas y medios
              de comunicación, llevamos un plan de responsabilidad social en educación, salud, ambiente y
              desarrollo comunal.
            </p>
          </div>
        </div>
      </section>

      <section className="cifras" aria-labelledby="cifras-titulo">
        <svg className="cf-fondo" viewBox="0 0 200 400" fill="none" aria-hidden>
          <path d="M70 400V30" />
          <path d="M58 90h24M58 170h24M58 250h24M58 330h24" />
          <path d="M70 70c30-8 52-30 64-62" />
          <path d="M70 150c-28-6-50-26-60-54" />
          <path d="M70 230c34-6 62-30 80-66" />
          <path d="M130 400V140" />
          <path d="M118 210h24M118 290h24M118 370h24" />
          <path d="M130 190c22-5 40-20 50-44" />
          <path d="M130 270c-20-4-36-18-44-38" />
        </svg>
        <div className="wrap cf">
          <div className="cf-cabeza">
            <p className="eyebrow" id="cifras-titulo" data-reveal>
              CATSA en cifras
            </p>
            <Titular className="cf-titulo" texto="Hecho por gente de Guanacaste." />
          </div>

          <dl className="cf-gente">
            {GENTE.map((c) => (
              <div key={c.texto} className="cf-persona" data-reveal>
                <dt>{c.texto}</dt>
                <dd className="cf-n">
                  <span data-count={c.valor}>{miles(c.valor)}</span>
                  <i>{c.sufijo}</i>
                </dd>
              </div>
            ))}
          </dl>

          <BandaCifras
            titulo="Un día de zafra, del campo a la destilería"
            descripcion="Cuatro etapas de una misma caña guanacasteca, en una jornada de zafra."
            cifras={RECORRIDO}
          />
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
        <div className="mbg" data-px="70" style={fondo(fotos.camposAereo.src)} />
        <div className="wrap">
          <ConEspacio espacio={espacioSobreMisionVision}>
            {({ mision, vision }) => (
              <div className="grid">
                <div className="card" data-reveal>
                  <div className="lab">Misión</div>
                  <Titular como="p" retardo={120} texto={mision} />
                </div>
                <div className="card" data-reveal>
                  <div className="lab">Visión</div>
                  <Titular como="p" retardo={180} texto={vision} />
                </div>
              </div>
            )}
          </ConEspacio>
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

      <section className="gq" id="guanacastequidad">
        <div className="wrap">
          <div className="gq-text" data-reveal>
            <p className="eyebrow">Nuestra guanacastequidad</p>
            <Titular texto="Lo mejor de Guanacaste es su gente y su cultura." />
            <p>
              Guanacaste es la tierra que nos vio nacer como empresa y que ha visto nacer a gran parte de
              nuestra fuerza laboral. Por eso la guanacastequidad es parte esencial de nuestra cultura
              empresarial: rescatamos y valoramos el ser guanacasteco, con sus comidas, lenguaje, canciones,
              bailes, costumbres y tradiciones.
            </p>
            <p>
              Cada año celebramos el Día de la Anexión de Guanacaste con la alegría y el folclor de la
              provincia, y desarrollamos actividades de proyección comunal que dan valor a su cultura.
            </p>
          </div>
          <div className="gq-fotos">
            {[fotos.comida, fotos.baile, fotos.tope].map((f) => (
              <div key={f.src} className="gq-foto" data-reveal="foto">
                <Image src={f.src} alt={f.alt} fill sizes="(max-width: 900px) 100vw, 33vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ConEspacio espacio={espacioSobreCierre}>
        {(datos) => (
          <Cierre
            {...datos}
            principal={{ titulo: "Ver puestos disponibles", href: "/puestos" }}
            secundario={{ titulo: "Escríbanos", href: "/contacto" }}
          />
        )}
      </ConEspacio>
    </div>
  );
}
