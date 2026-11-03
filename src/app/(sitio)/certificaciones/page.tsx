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
    "ISO 9001, FSSC 22000, Kosher, ISCC EU y Esencial Costa Rica: los sellos que auditan la calidad e inocuidad de cada producto de CATSA.",
};

const TEXTOS: Record<(typeof sellos)[number]["clave"], { titulo: string; texto: string }> = {
  "iso-9001": {
    titulo: "ISO 9001",
    texto:
      "ICONTEC certifica que nuestro Sistema de Gestión de la Calidad cumple los requisitos de la norma internacional, garantizando procesos consistentes y mejora continua.",
  },
  "fssc-22000": {
    titulo: "FSSC 22000",
    texto:
      "Certificación de inocuidad alimentaria reconocida mundialmente, basada en ISO 22000, que respalda la seguridad de nuestros productos para la industria de alimentos.",
  },
  kosher: {
    titulo: "Kosher",
    texto:
      "Certifica que los productos elaborados por CATSA cumplen las normas dietéticas judías, abriendo las puertas a clientes del mercado internacional.",
  },
  iscc: {
    titulo: "ISCC EU",
    texto:
      "Sistema de certificación de sostenibilidad y trazabilidad de la materia prima, cumpliendo los requisitos del ISCC EU para toda la cadena de valor.",
  },
  esencial: {
    titulo: "Esencial Costa Rica",
    texto:
      "Marca país que respalda la calidad, la sostenibilidad y el origen costarricense de nuestros productos ante el mundo.",
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
                <Link className="cert-link" href="/contacto">
                  Solicitar el certificado <span className="arw">→</span>
                </Link>
              </div>
            </article>
          ))}
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
