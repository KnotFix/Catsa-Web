import Link from "next/link";
import { Contenedor } from "@/components/shared/contenedor";
import { navegacionSitio, sitio } from "@/config/sitio";
import { obtenerAjustes } from "@/features/contenido/ajustes";

const REDES = [
  { clave: "facebook", nombre: "Facebook" },
  { clave: "linkedin", nombre: "LinkedIn" },
  { clave: "instagram", nombre: "Instagram" },
  { clave: "youtube", nombre: "YouTube" },
] as const;

// Contacto y redes salen de Ajustes del sitio (Administración); lo vacío no se muestra.
export async function PieSitio() {
  const ajustes = await obtenerAjustes();
  const redes = REDES.filter((r) => ajustes[r.clave]);
  const hayContacto = ajustes.telefono || ajustes.whatsapp || ajustes.correo || ajustes.horario;

  return (
    <footer className="bg-catsa-foot text-catsa-cream">
      <Contenedor className="grid gap-8 py-12 text-sm movil:grid-cols-2 tablet:grid-cols-[1.5fr_1fr_1.2fr_1fr]">
        <div>
          <p className="font-heading text-xl font-bold">{sitio.nombre}</p>
          <p className="mt-2 leading-relaxed text-catsa-cream/80">
            {sitio.nombreLegal}
            <br />
            {ajustes.direccion || sitio.ubicacion}
          </p>
        </div>

        <Columna titulo="Sitio">
          {navegacionSitio.map((enlace) => (
            <li key={enlace.href}>
              <Link href={enlace.href} className={enlaceClase}>
                {enlace.titulo}
              </Link>
            </li>
          ))}
        </Columna>

        {hayContacto && (
          <Columna titulo="Contacto">
            {ajustes.telefono && (
              <li>
                <a href={`tel:${ajustes.telefono.replace(/[^\d+]/g, "")}`} className={enlaceClase}>
                  Tel. {ajustes.telefono}
                </a>
              </li>
            )}
            {ajustes.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${ajustes.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={enlaceClase}
                >
                  WhatsApp
                </a>
              </li>
            )}
            {ajustes.correo && (
              <li>
                <a href={`mailto:${ajustes.correo}`} className={`${enlaceClase} break-all`}>
                  {ajustes.correo}
                </a>
              </li>
            )}
            {ajustes.horario && <li className="leading-snug text-catsa-cream/80">{ajustes.horario}</li>}
          </Columna>
        )}

        {redes.length > 0 && (
          <Columna titulo="Síganos">
            {redes.map((r) => (
              <li key={r.clave}>
                <a href={ajustes[r.clave]} target="_blank" rel="noopener noreferrer" className={enlaceClase}>
                  {r.nombre}
                </a>
              </li>
            ))}
          </Columna>
        )}
      </Contenedor>
      <Contenedor>
        <p className="border-t border-white/15 py-5 text-xs text-catsa-cream/70">
          © {sitio.nombreLegal} Todos los derechos reservados.
        </p>
      </Contenedor>
    </footer>
  );
}

const enlaceClase = "text-catsa-cream/80 transition-colors hover:text-white";

function Columna({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold tracking-widest text-catsa-sprout uppercase">{titulo}</h2>
      <ul className="grid gap-2">{children}</ul>
    </div>
  );
}
