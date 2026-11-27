import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Cierre } from "@/components/sitio/cierre";
import { Titular } from "@/components/sitio/titular";
import { ConEspacio } from "@/features/contenido/components/con-espacio";
import {
  espacioInicioCierre,
  espacioInicioGuanacastequidad,
  espacioInicioHero,
} from "@/features/contenido/espacios";
import { CargandoNoticias, ListaNoticias } from "@/features/noticias/components/lista-noticias";
import { Escaparate } from "@/features/sitio/components/escaparate";
import { PanelesAreas } from "@/features/sitio/components/paneles-areas";
import { Portada } from "@/features/sitio/components/portada";
import { fotos, sellos } from "@/features/sitio/imagenes";
import "./inicio.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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
 * Inicio, según el boceto aprobado. La portada, la guanacastequidad y el cierre
 * son espacios editables del panel. El boceto traía un testimonio de colaborador con
 * nombre inventado: en su lugar van las últimas noticias, hasta que CATSA
 * entregue un testimonio real.
 */
export default function InicioPage() {
  return (
    <div className="pg-inicio">
      <section className="hero">
        <ConEspacio espacio={espacioInicioHero}>{(datos) => <Portada {...datos} />}</ConEspacio>
      </section>

      <section className="certsec">
        <div className="head" data-reveal>
          <p className="lab">Nuestras certificaciones</p>
          <Link href="/certificaciones">Ver todas las certificaciones →</Link>
        </div>
        {/* Cinta a todo lo ancho. Cuatro vueltas para que no tenga corte ni en pantallas
            muy anchas; solo la primera se anuncia. */}
        <div className="marquee">
          <div className="track">
            {[0, 1, 2, 3].flatMap((vuelta) =>
              sellos.map((s) => (
                <Link
                  key={`${s.clave}-${vuelta}`}
                  href={`/certificaciones#${s.clave}`}
                  className="sello"
                  aria-hidden={vuelta > 0 || undefined}
                  tabIndex={vuelta > 0 ? -1 : undefined}
                >
                  <span className="sello-logo">
                    <Image
                      src={s.src}
                      alt=""
                      width={s.ancho}
                      height={s.alto}
                      sizes={`${Math.ceil((56 * s.ancho) / s.alto)}px`}
                    />
                  </span>
                  <span className="sello-txt">
                    <span className="sello-nombre">{s.nombre}</span>
                    <span className="sello-tema">{s.tema}</span>
                  </span>
                </Link>
              )),
            )}
          </div>
        </div>
      </section>

      <section className="areas-inicio">
        <div data-reveal className="mb-8">
          <p className="lead-lab">Nuestras áreas</p>
          <h2 className="h2 max-w-[24ch]">Cuatro áreas, un mismo compromiso con la caña.</h2>
        </div>
        <div data-reveal>
          <PanelesAreas />
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

      <ConEspacio espacio={espacioInicioGuanacastequidad}>
        {({ antetitulo, titulo, texto, foto }) => {
          // Sin foto en el panel, la del diseño.
          const imagen = foto
            ? { src: foto.url, alt: foto.alt, ancho: foto.ancho, alto: foto.alto }
            : {
                src: fotos.comida.src,
                alt: fotos.comida.alt,
                ancho: fotos.comida.ancho,
                alto: fotos.comida.alto,
              };
          return (
            <section className="split-sec">
              <div data-reveal="foto" className="overflow-hidden rounded-[14px]">
                <Image
                  src={imagen.src}
                  alt={imagen.alt}
                  width={imagen.ancho}
                  height={imagen.alto}
                  sizes="(max-width: 900px) 100vw, 560px"
                />
              </div>
              <div data-reveal>
                <p className="lead-lab">{antetitulo}</p>
                <Titular className="h2 mb-4 max-w-[20ch]" texto={titulo} />
                <p className="mb-5 max-w-[60ch] text-[17px] leading-relaxed text-catsa-body">{texto}</p>
                <Link
                  href="/sobre-nosotros#guanacastequidad"
                  className="text-[15px] font-bold text-catsa-green"
                >
                  Conozca nuestra guanacastequidad →
                </Link>
              </div>
            </section>
          );
        }}
      </ConEspacio>

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
            <ListaNoticias limite={3} destacar />
          </Suspense>
        </div>
      </section>

      <ConEspacio espacio={espacioInicioCierre}>
        {(datos) => (
          <Cierre
            {...datos}
            principal={{ titulo: "Solicitar información", href: "/contacto" }}
            secundario={{ titulo: "Ver catálogo", href: "/productos" }}
          />
        )}
      </ConEspacio>
    </div>
  );
}
