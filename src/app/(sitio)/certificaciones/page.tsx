import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { Cierre } from "@/components/sitio/cierre";
import { Titular } from "@/components/sitio/titular";
import { sellos } from "@/features/sitio/imagenes";
import "./estilos.css";

export const metadata: Metadata = {
  title: "Certificaciones",
  description:
    "ISO 9001, FSSC 22000, Kosher, ISCC y Esencial Costa Rica: los sellos que auditan la calidad e inocuidad de cada producto de CATSA.",
};

// Textos y alcances tomados de Gestión de Calidad, en catsa.net.
const TEXTOS: Record<(typeof sellos)[number]["clave"], { titulo: string; texto: string; alcance?: string }> =
  {
    "iso-9001": {
      titulo: "ISO 9001",
      texto:
        "ICONTEC certifica que nuestro Sistema de Gestión de la Calidad cumple la norma ISO 9001:2015, la referencia internacional para asegurar que los procesos satisfagan las necesidades de los clientes.",
      alcance:
        "Azúcar refino, blanco especial, blanco de plantación y crudo; alcohol etílico para bebidas y alcohol etílico anhidro.",
    },
    "fssc-22000": {
      titulo: "FSSC 22000",
      texto:
        "LSQA certifica nuestro Sistema de Gestión de Inocuidad de los Alimentos según ISO 22000, ISO/TS 22002-1 y los requisitos adicionales de FSSC 22000, un esquema reconocido por la Global Food Safety Initiative (GFSI).",
      alcance: "Azúcar blanco especial, blanco y crudo.",
    },
    kosher: {
      titulo: "Kosher",
      texto:
        "Certifica que nuestros azúcares cumplen las normas de kashrut, la ley dietética judía, para clientes que exigen alimentos aptos.",
      alcance: "Azúcar refino, azúcar especial 150 y azúcar blanco de plantación.",
    },
    iscc: {
      titulo: "ISCC",
      texto:
        "Control Union certifica que cumplimos el sistema ISCC de sostenibilidad y emisiones de gases de efecto invernadero: la biomasa no viene de tierras de alta biodiversidad, aplicamos buenas prácticas agrícolas y respetamos los derechos humanos, laborales y de tierras.",
    },
    esencial: {
      titulo: "Esencial Costa Rica",
      texto:
        "Licencia de la marca país, que reconoce a las empresas costarricenses por su excelencia, sostenibilidad, innovación y vínculo con el desarrollo del país.",
    },
  };

export default function CertificacionesPage() {
  return (
    <div className="pg-cert">
      <CabeceraPagina
        antetitulo="Calidad garantizada"
        titulo="Certificaciones que respaldan cada grano"
        bajada="Nuestros procesos son auditados por entes certificadores independientes que garantizan la calidad e inocuidad de cada producto."
        icono={
          <>
            <circle pathLength={1} cx="12" cy="9" r="5.5" />
            <path pathLength={1} d="M8.4 13.4L7 21l5-2.5 5 2.5-1.4-7.6" />
          </>
        }
      />

      <section>
        <div className="wrap clist">
          {sellos.map((s, i) => (
            <article key={s.clave} className="crow" data-reveal>
              <div className="logo">
                <Image src={s.src} alt={s.nombre} width={200} height={120} />
              </div>
              <div className="cb">
                <div className="num">{String(i + 1).padStart(2, "0")}</div>
                <Titular texto={TEXTOS[s.clave].titulo} />
                <p>{TEXTOS[s.clave].texto}</p>
                {TEXTOS[s.clave].alcance && (
                  <p className="alcance">
                    <b>Alcance:</b> {TEXTOS[s.clave].alcance}
                  </p>
                )}
                <Link className="cert-link" href="/contacto">
                  Solicitar el certificado <span className="arw">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="politica">
        <div className="wrap" data-reveal>
          <p className="lead-lab">Política de calidad e inocuidad</p>
          <Titular texto="Nuestro compromiso con cada cliente." />
          <p>
            Nuestro compromiso es producir caña de azúcar y fabricar los productos derivados apegándonos a los
            acuerdos establecidos con nuestros clientes, cumpliendo con los requisitos legales y
            reglamentarios, aplicando las normas de calidad e inocuidad según nuestro alcance y promoviendo el
            cumplimiento de los objetivos del Sistema de Gestión de Calidad e Inocuidad, para así satisfacer
            de acuerdo con nuestros recursos sus requerimientos.
          </p>
          <p>
            Para cumplir con lo anterior desde el contexto de la organización, buscaremos la mejora continua
            de nuestros procesos y productos, promoviendo el trabajo en equipo, la comunicación integral, el
            desarrollo de las competencias de nuestros colaboradores y la actualización del sistema de gestión
            de calidad e inocuidad alimentaria.
          </p>
        </div>
      </section>

      <Cierre
        antetitulo="Respaldo internacional"
        titulo="Calidad certificada en cada grano."
        texto="Solicite los certificados vigentes o más información sobre nuestros procesos de calidad e inocuidad."
        principal={{ titulo: "Solicitar certificados", href: "/contacto" }}
        secundario={{ titulo: "Ver nuestro proceso", href: "/como-trabajamos" }}
      />
    </div>
  );
}
