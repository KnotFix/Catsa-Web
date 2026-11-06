import type { Metadata } from "next";
import Image from "next/image";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { Cierre } from "@/components/sitio/cierre";
import { ConEspacio } from "@/features/contenido/components/con-espacio";
import { espacioRseEncabezado, espacioRseCierre } from "@/features/contenido/espacios";
import { Titular } from "@/components/sitio/titular";
import { fondo, fotos } from "@/features/sitio/imagenes";
import { cn } from "@/lib/utils";
import "./estilos.css";

export const metadata: Metadata = {
  title: "RSE",
  description:
    "Salud, educación, desarrollo comunal, reforestación y ambiente: los programas con los que CATSA trabaja junto a Guardia, Palmira, El Paso Tempisque e Irigaray.",
};

const PUENTES = [
  {
    programa: "Programa de Salud",
    titulo: "Puente al bienestar",
    texto:
      "Apoyamos a las comunidades en iniciativas para el bienestar y la salud de la población. Elegimos cada proyecto por su impacto, la población beneficiada y el aporte de la propia comunidad.",
    logros: ["Proyecto de la ASADA de El Paso Tempisque"],
    foto: fotos.salud.src,
  },
  {
    programa: "Programa de Educación",
    titulo: "Puente al futuro",
    texto:
      "Contribuimos a formar a las nuevas generaciones guanacastecas. Con Grupo Nación y su programa Libros para Todos hemos entregado más de 7.000 libros de texto a estudiantes de Guardia, El Paso, Palmira, Los Jocotes y La Villita.",
    logros: [
      "Laboratorio de informática de la Escuela de El Paso Tempisque",
      "Área de juegos para el CEN-CINAI de Palmira",
      "Donación de terreno para la Escuela de Guardia",
      "Becas de útiles escolares por excelencia académica, «Llenemos Mochilas»",
    ],
    foto: fotos.educacion.src,
  },
  {
    programa: "Programa de Desarrollo Comunal",
    titulo: "Puente de apoyo",
    texto:
      "Facilitamos proyectos de infraestructura, cultura y valores guanacastecos, actividades deportivas y recreativas, y seguridad vial. Los elegimos por el interés de la comunidad y el impacto en su bienestar.",
    logros: [
      "Remodelación de la Ermita de Nuestro Señor de la Agonía, en Liberia, con participación de los colaboradores",
      "Paradas de autobús de Irigaray",
    ],
    foto: fotos.desarrolloComunal.src,
  },
  {
    programa: "Programa de Reforestación y Voluntariado",
    titulo: "Puentes de unión",
    texto:
      "Sembramos especies nativas y preciosas a la orilla del río Tempisque junto a las comunidades y los niños de las escuelas vecinas. Lo lidera un colaborador agrícola, amante del ambiente y la historia.",
    logros: [
      "Gente CATSA: colaboradores que donan tres horas al mes a sembrar árboles",
      "Voluntariado gerencial con el Banco de Alimentos de Guanacaste",
    ],
    foto: fotos.reforestacion.src,
  },
];

const FAUNA = [fotos.jabiru, fotos.ciguena, fotos.cocodrilo, fotos.pizote];

export default function RsePage() {
  return (
    <div className="pg-rse">
      <ConEspacio espacio={espacioRseEncabezado}>
        {(datos) => (
          <CabeceraPagina
            {...datos}
            icono={
              <path
                pathLength={1}
                d="M12 20s-6.6-4.1-6.6-9.1A3.6 3.6 0 0 1 12 8.4a3.6 3.6 0 0 1 6.6 2.5c0 5-6.6 9.1-6.6 9.1z"
              />
            }
          />
        )}
      </ConEspacio>

      <section className="intro-line">
        <div className="wrap" data-reveal>
          <p className="lead-lab text-center">Cuatro puentes</p>
          <Titular texto="Programas que llevamos con las organizaciones comunales de la zona." />
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
              <ul className="logros">
                {p.logros.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      <section className="ambiente">
        <div className="wrap">
          <div className="amb-head" data-reveal>
            <p className="lead-lab">Nuestro compromiso con el ambiente</p>
            <Titular texto="Vecinos del río Tempisque." />
            <p>
              Estamos dentro de la cuenca del río Tempisque, una de las más importantes de Costa Rica. En
              nuestra zona viven y pasan aves de humedal como el galán sin ventura, en peligro de extinción,
              la espátula rosada y el garzón. Destinamos zonas de protección para la flora y la fauna, un
              harén para la reproducción de la iguana verde, reforestamos con árboles nativos y vigilamos para
              evitar la cacería ilegal.
            </p>
          </div>
          <div className="fauna">
            {FAUNA.map((f) => (
              <figure key={f.src} data-reveal>
                <div className="ff" data-reveal="foto">
                  <Image src={f.src} alt={f.alt} fill sizes="(max-width: 900px) 50vw, 25vw" />
                </div>
                <figcaption>{f.alt}</figcaption>
              </figure>
            ))}
          </div>
          <div className="amb-grid">
            <div className="amb-card" data-reveal>
              <h3>Cosecha en verde</h3>
              <p>
                Contamos con máquinas para cosechar la caña en verde, sin quemarla, y vamos construyendo
                experiencia en varias secciones de la empresa. El reto es manejar más de 15 toneladas por
                hectárea de residuos en el campo, sobre todo en suelos arcillosos al inicio de las lluvias.
              </p>
            </div>
            <div className="amb-card" data-reveal>
              <h3>Rotación arroz – caña</h3>
              <p>
                Desde hace más de diez años rotamos arroz anegado y caña en al menos 500 hectáreas por año. La
                caña gana hasta un 30 % de rendimiento en su primera cosecha y ambos cultivos necesitan
                considerablemente menos agroquímicos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ConEspacio espacio={espacioRseCierre}>
        {(datos) => (
          <Cierre
            {...datos}
            principal={{ titulo: "Escríbanos", href: "/contacto" }}
            secundario={{ titulo: "Conozca CATSA", href: "/sobre-nosotros" }}
          />
        )}
      </ConEspacio>
    </div>
  );
}
