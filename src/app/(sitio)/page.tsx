import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Cierre } from "@/components/sitio/cierre";
import { Titular } from "@/components/sitio/titular";
import { obtenerEspacio } from "@/features/contenido/api";
import { espacioInicioHero } from "@/features/contenido/espacios";
import { CargandoNoticias, ListaNoticias } from "@/features/noticias/components/lista-noticias";
import { Escaparate, Portada } from "@/features/sitio/components/portada";
import { fondo, fotos, sellos } from "@/features/sitio/imagenes";
import "./inicio.css";

const CIFRAS = [
  { valor: 450, sufijo: "+", texto: "Colaboradores permanentes" },
  { valor: 1000, sufijo: "+", texto: "Colaboradores en zafra" },
  { valor: 10551, sufijo: " ha", texto: "Hectáreas propias, más ~400 productores" },
];

const AREAS = [
  {
    clase: "b-big",
    nombre: "Industrial",
    etiqueta: "Producción",
    foto: fotos.refineria.src,
    texto: "7.500 toneladas de caña al día, refinería y destilería de alcohol.",
  },
  {
    clase: "b-wide",
    nombre: "Agrícola",
    etiqueta: "Campo",
    foto: fotos.maquinaria.src,
    texto: "Siembra y cosecha de la caña, coordinada con cerca de 400 productores independientes.",
  },
  { clase: "b-s1", nombre: "Administración", foto: fotos.rotulo.src },
  { clase: "b-s2", nombre: "Taller", foto: fotos.camion.src },
];

const PUENTES = [
  {
    titulo: "Puente al bienestar",
    programa: "Programa de Salud",
    texto: "Apoyamos iniciativas comunitarias de bienestar y salud de la población.",
    icono: (
      <path d="M19.3 5.7a5 5 0 0 0-7.1 0l-.2.2-.2-.2a5 5 0 0 0-7.1 7.1L12 20l7.3-7.2a5 5 0 0 0 0-7.1z" />
    ),
  },
  {
    titulo: "Puente al futuro",
    programa: "Programa de Educación",
    texto: "Contribuimos a la formación de las nuevas generaciones guanacastecas.",
    icono: (
      <>
        <path d="M3 9l9-4 9 4-9 4-9-4z" />
        <path d="M7 11.5V16c0 1.1 2.2 2 5 2s5-.9 5-2v-4.5" />
      </>
    ),
  },
  {
    titulo: "Puente de apoyo",
    programa: "Programa de Desarrollo Comunal",
    texto: "Facilitamos proyectos de infraestructura, cultura y valores guanacastecos.",
    icono: (
      <>
        <circle cx="9" cy="9" r="2.6" />
        <path d="M3 19c0-2.8 2.7-5 6-5s6 2.2 6 5" />
        <path d="M16 11a2.4 2.4 0 1 0 0-4.8" />
        <path d="M17.5 19c0-1.9-.7-3.2-1.8-4.1 2.6.2 4.3 1.9 4.3 4.1" />
      </>
    ),
  },
  {
    titulo: "Puentes de unión",
    programa: "Reforestación y Voluntariado",
    texto: "Perpetuamos los árboles en los linderos del río y comunidades cercanas.",
    icono: (
      <>
        <path d="M12 21V9" />
        <path d="M12 9C12 6 9.8 4 7 4c0 3 2.2 5 5 5z" />
        <path d="M12 9c0-3 2.2-5 5-5 0 3-2.2 5-5 5z" />
      </>
    ),
  },
];

/**
 * Inicio, según el boceto aprobado. El titular de la portada es el espacio
 * editable "inicio.hero". El boceto traía un testimonio de colaborador con
 * nombre inventado: en su lugar van las últimas noticias, hasta que CATSA
 * entregue un testimonio real.
 */
export default function InicioPage() {
  return (
    <div className="pg-inicio">
      <section className="hero">
        {/* Con la API arriba, el texto está en caché y sale en el HTML estático. */}
        <Suspense fallback={<Portada {...espacioInicioHero.porDefecto} />}>
          <PortadaEditable />
        </Suspense>
        <div className="hero-stats">
          <div className="wrap">
            {CIFRAS.map((c) => (
              <div key={c.texto} className="hs">
                <div className="n">
                  <span data-count={c.valor}>{c.valor.toLocaleString("de-DE")}</span>
                  <i>{c.sufijo}</i>
                </div>
                <div className="l">{c.texto}</div>
              </div>
            ))}
            <div className="hs">
              <div className="n">1975</div>
              <div className="l">Año de fundación en Guardia de Liberia</div>
            </div>
          </div>
        </div>
      </section>

      <section className="certsec">
        <div className="head" data-reveal>
          <p className="lab">Nuestras certificaciones</p>
          <Link href="/certificaciones">Ver todas las certificaciones →</Link>
        </div>
        <div className="marquee">
          {/* Dos vueltas de sellos para que la cinta no tenga corte; la copia no se anuncia. */}
          <div className="track">
            {[...sellos, ...sellos].map((s, i) => (
              <Image
                key={`${s.clave}-${i}`}
                src={s.src}
                alt={i < sellos.length ? s.nombre : ""}
                aria-hidden={i >= sellos.length || undefined}
                width={120}
                height={60}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="areas-inicio">
        <div data-reveal className="mb-8">
          <p className="lead-lab">Nuestras áreas</p>
          <h2 className="h2 max-w-[24ch]">Cuatro áreas, un mismo compromiso con la caña.</h2>
        </div>
        <div className="bento" data-reveal>
          {AREAS.map((a) => (
            <Link key={a.nombre} className={`bcell ${a.clase}`} href="/areas">
              <div className="bimg" style={fondo(a.foto)} />
              <div className="bveil" />
              <div className="bc">
                {a.etiqueta && <div className="bt">{a.etiqueta}</div>}
                <h3>{a.nombre}</h3>
                {a.texto && <p>{a.texto}</p>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="showcase">
        <div className="sc-head">
          <p className="eyebrow">Lo que cultivamos en Guanacaste</p>
          <h2>
            Productos
            <br />
            seleccionados
          </h2>
        </div>
        <Escaparate />
        <div className="sc-end">
          <p>Explore el catálogo completo con la ficha técnica de cada producto.</p>
          <Link className="btn btn-primary" href="/productos">
            Ver todo el catálogo →
          </Link>
        </div>
      </section>

      <section className="split-sec">
        <div data-reveal className="overflow-hidden rounded-[14px]">
          <Image
            src={fotos.comida.src}
            alt={fotos.comida.alt}
            width={fotos.comida.ancho}
            height={fotos.comida.alto}
            sizes="(max-width: 900px) 100vw, 560px"
          />
        </div>
        <div data-reveal>
          <p className="lead-lab">Nuestra guanacastequidad</p>
          <Titular
            className="h2 mb-4 max-w-[20ch]"
            texto="Lo mejor de Guanacaste es su gente y su cultura."
          />
          <p className="mb-5 max-w-[60ch] text-[17px] leading-relaxed text-catsa-body">
            Guanacaste nos vio nacer como empresa en 1975 y vio nacer a gran parte de quienes trabajan con
            nosotros. Celebramos el Día de la Anexión con sus comidas, bailes y tradiciones, y damos trabajo a
            más de 450 colaboradores permanentes y a más de 1.000 personas en zafra.
          </p>
          <Link href="/sobre-nosotros#guanacastequidad" className="text-[15px] font-bold text-catsa-green">
            Conozca nuestra guanacastequidad →
          </Link>
        </div>
      </section>

      <section className="rse-inicio">
        <div className="wrap">
          <div data-reveal>
            <p className="lead-lab">Responsabilidad social empresarial</p>
            <Titular className="h2" texto="Cuatro puentes hacia las comunidades de Guanacaste." />
          </div>
          <div className="rgrid" data-reveal>
            {PUENTES.map((p, i) => (
              <div key={p.titulo} className="rcol">
                <div className="top">
                  <span className="ico">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      {p.icono}
                    </svg>
                  </span>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3>{p.titulo}</h3>
                <p className="tag">{p.programa}</p>
                <p>{p.texto}</p>
              </div>
            ))}
          </div>
          <div data-reveal>
            <Link className="btn btn-primary mt-9" href="/rse">
              Ver programas completos →
            </Link>
          </div>
        </div>
      </section>

      <section className="noticias-inicio">
        <div className="wrap">
          <div data-reveal className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="lead-lab">Sala de prensa</p>
              <Titular className="h2 mb-0" texto="Lo último de CATSA" />
            </div>
            <Link href="/noticias" className="text-[15px] font-bold text-catsa-green">
              Ver todas las noticias →
            </Link>
          </div>
          <Suspense fallback={<CargandoNoticias />}>
            <ListaNoticias limite={3} />
          </Suspense>
        </div>
      </section>

      <Cierre
        antetitulo="Hablemos"
        titulo="Hablemos de lo que produce Guanacaste."
        texto="Solicite información sobre nuestros productos, certificaciones u oportunidades comerciales. Le respondemos con gusto."
        principal={{ titulo: "Solicitar información", href: "/contacto" }}
        secundario={{ titulo: "Ver catálogo", href: "/productos" }}
      />
    </div>
  );
}

async function PortadaEditable() {
  return <Portada {...await obtenerEspacio(espacioInicioHero)} />;
}
