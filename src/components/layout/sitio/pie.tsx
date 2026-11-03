import Link from "next/link";
import { pieSitio, sitio } from "@/config/sitio";
import { obtenerAjustes } from "@/features/contenido/ajustes";

const REDES = [
  { clave: "facebook", nombre: "Facebook" },
  { clave: "linkedin", nombre: "LinkedIn" },
  { clave: "instagram", nombre: "Instagram" },
  { clave: "youtube", nombre: "YouTube" },
] as const;

// Estructura del boceto. Contacto y redes salen de Ajustes del sitio
// (Administración); lo vacío no se muestra.
export async function PieSitio() {
  const ajustes = await obtenerAjustes();
  const redes = REDES.filter((r) => ajustes[r.clave]);

  return (
    <footer className="pie-sitio">
      <div className="wrap">
        <div className="fgrid">
          <div>
            <div className="flogo">{sitio.nombre}</div>
            <p>
              {sitio.nombreLegal}
              <br />
              {ajustes.direccion || sitio.ubicacion}
            </p>
            {(ajustes.telefono || ajustes.whatsapp || ajustes.correo || ajustes.horario) && (
              <ul className="mt-3">
                {ajustes.telefono && (
                  <li>
                    <a href={`tel:${ajustes.telefono.replace(/[^\d+]/g, "")}`}>Tel. {ajustes.telefono}</a>
                  </li>
                )}
                {ajustes.whatsapp && (
                  <li>
                    <a href={`https://wa.me/${ajustes.whatsapp}`} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  </li>
                )}
                {ajustes.correo && (
                  <li>
                    <a href={`mailto:${ajustes.correo}`} className="break-all">
                      {ajustes.correo}
                    </a>
                  </li>
                )}
                {ajustes.horario && <li className="leading-snug opacity-80">{ajustes.horario}</li>}
              </ul>
            )}
          </div>
          {pieSitio.map((columna) => (
            <div key={columna.titulo}>
              <h2>{columna.titulo}</h2>
              <ul>
                {columna.enlaces.map((e) => (
                  <li key={e.href}>
                    <Link href={e.href}>{e.titulo}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="fbottom">
          <span>© {sitio.nombreLegal} Todos los derechos reservados.</span>
          {redes.length > 0 ? (
            <span className="flex flex-wrap gap-4">
              {redes.map((r) => (
                <a key={r.clave} href={ajustes[r.clave]} target="_blank" rel="noopener noreferrer">
                  {r.nombre}
                </a>
              ))}
            </span>
          ) : (
            <span>{sitio.certificaciones}</span>
          )}
        </div>
      </div>
    </footer>
  );
}
