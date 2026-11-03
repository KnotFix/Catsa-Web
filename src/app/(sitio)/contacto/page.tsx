import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { Cierre } from "@/components/sitio/cierre";
import { Titular } from "@/components/sitio/titular";
import { sitio } from "@/config/sitio";
import { obtenerAjustes } from "@/features/contenido/ajustes";
import "./estilos.css";

export const metadata: Metadata = {
  title: "Contáctenos",
  description:
    "Escríbanos para consultas comerciales, de calidad o institucionales. Filadelfia, Carrillo, Guanacaste, Costa Rica.",
};

// Los datos salen de Ajustes del sitio, la misma fuente del pie. El
// formulario con envío de correo espera la decisión de CATSA (pendiente 3).
export default async function ContactoPage() {
  const ajustes = await obtenerAjustes();
  const direccion = ajustes.direccion || sitio.ubicacion;

  return (
    <div className="pg-contacto">
      <CabeceraPagina
        antetitulo="Hablemos"
        titulo="Contáctenos"
        bajada="Estamos a la orden para atender sus consultas comerciales, de calidad o institucionales."
        icono={
          <>
            <path pathLength={1} d="M3 6h18v12H3z" />
            <path pathLength={1} d="M3 7l9 6 9-6" />
          </>
        }
      />

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
          </div>

          <div className="cx-info" data-reveal>
            <Titular texto="Información de contacto" />
            <div className="info-item">
              <div className="lbl">Dirección</div>
              <div className="val">{direccion}</div>
            </div>
            {ajustes.telefono && (
              <div className="info-item">
                <div className="lbl">Teléfono</div>
                <a className="val" href={`tel:${ajustes.telefono.replace(/[^\d+]/g, "")}`}>
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
            <a
              className="mapa"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`CATSA ${direccion}`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cómo llegar <span className="arw">→</span>
            </a>
          </div>
        </div>
      </section>

      <Cierre
        antetitulo="Trabaje con nosotros"
        titulo="¿Busca sumarse al equipo?"
        texto="Somos una de las principales fuentes de empleo de Guanacaste. Conozca las vacantes abiertas."
        principal={{ titulo: "Ver puestos disponibles", href: "/puestos" }}
        secundario={{ titulo: "Conozca CATSA", href: "/sobre-nosotros" }}
      />
    </div>
  );
}
