import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { Cierre } from "@/components/sitio/cierre";
import { ConEspacio } from "@/features/contenido/components/con-espacio";
import { espacioContactoEncabezado, espacioContactoCierre } from "@/features/contenido/espacios";
import { Titular } from "@/components/sitio/titular";
import { sedes, sitio } from "@/config/sitio";
import { obtenerAjustes } from "@/features/contenido/ajustes";
import "./estilos.css";

export const metadata: Metadata = {
  title: "Contáctenos",
  description:
    "Escríbanos para consultas comerciales, de calidad o institucionales. Planta en Guardia de Liberia, Guanacaste, y oficinas en San José.",
};

const telefono = (t: string) => `tel:${t.replace(/[^\d+]/g, "")}`;
const mapa = (lugar: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lugar)}`;

// Correo, WhatsApp y horario salen de Ajustes del sitio, la misma fuente del
// pie; las dos sedes son fijas. El formulario con envío de correo espera la
// decisión de CATSA (pendiente 3).
export default async function ContactoPage() {
  const ajustes = await obtenerAjustes();

  return (
    <div className="pg-contacto">
      <ConEspacio espacio={espacioContactoEncabezado}>
        {(datos) => (
          <CabeceraPagina
            {...datos}
            icono={
              <>
                <path pathLength={1} d="M3 6h18v12H3z" />
                <path pathLength={1} d="M3 7l9 6 9-6" />
              </>
            }
          />
        )}
      </ConEspacio>

      <section className="band">
        <div className="wrap cx-grid">
          <div className="cx-card" data-reveal>
            <Titular texto="Escríbanos" />
            <p>
              Cuéntenos qué necesita: información de productos, certificados, cotizaciones o cualquier
              consulta institucional. Le respondemos en horario de oficina.
            </p>
            {ajustes.correo || ajustes.whatsapp ? (
              <div className="acciones">
                {ajustes.correo && (
                  <a className="btn btn-primary" href={`mailto:${ajustes.correo}`}>
                    Escribir un correo
                  </a>
                )}
                {ajustes.whatsapp && (
                  <a
                    className="btn btn-line"
                    href={`https://wa.me/${ajustes.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Escribir por WhatsApp
                  </a>
                )}
              </div>
            ) : (
              <p className="vacio">Pronto publicaremos aquí nuestros medios de contacto.</p>
            )}
            <a className="mapa mt-7" href={sitio.sugerencias} target="_blank" rel="noopener noreferrer">
              Buzón de sugerencias o quejas <span className="arw">→</span>
            </a>
          </div>

          <div className="cx-info" data-reveal>
            <Titular texto="Información de contacto" />
            {ajustes.telefono && (
              <div className="info-item">
                <div className="lbl">Teléfono</div>
                <a className="val" href={telefono(ajustes.telefono)}>
                  {ajustes.telefono}
                </a>
              </div>
            )}
            {ajustes.correo && (
              <div className="info-item">
                <div className="lbl">Correo</div>
                <a className="val break-all" href={`mailto:${ajustes.correo}`}>
                  {ajustes.correo}
                </a>
              </div>
            )}
            {ajustes.horario && (
              <div className="info-item">
                <div className="lbl">Horario</div>
                <div className="val">{ajustes.horario}</div>
              </div>
            )}
            {ajustes.direccion && (
              <div className="info-item">
                <div className="lbl">Dirección</div>
                <div className="val">{ajustes.direccion}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="sedes-sec">
        <div className="wrap">
          <div data-reveal>
            <p className="lead-lab">Dónde estamos</p>
            <Titular texto="Nuestras sedes" />
          </div>
          <div className="sedes">
            {sedes.map((s) => (
              <article key={s.nombre} className="sede" data-reveal>
                <h3>{s.nombre}</h3>
                <p>{s.direccion}</p>
                <p className="apdo">{s.apartado}</p>
                <a className="tel" href={telefono(s.telefono)}>
                  {s.telefono}
                </a>
                <a className="mapa" href={mapa(s.mapa)} target="_blank" rel="noopener noreferrer">
                  Cómo llegar <span className="arw">→</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ConEspacio espacio={espacioContactoCierre}>
        {(datos) => (
          <Cierre
            {...datos}
            principal={{ titulo: "Ver puestos disponibles", href: "/puestos" }}
            secundario={{ titulo: "Conozca CATSA", href: "/sobre-nosotros" }}
          />
        )}
      </ConEspacio>
    </div>
  );
}
