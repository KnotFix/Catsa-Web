import Link from "next/link";
import { Contenedor } from "@/components/shared/contenedor";
import { navegacionSitio, sitio } from "@/config/sitio";
import { MenuMovil } from "./menu-movil";

export function EncabezadoSitio() {
  return (
    <header className="sticky top-0 z-40 border-b bg-catsa-paper/95 backdrop-blur">
      <Contenedor className="flex h-16 items-center justify-between">
        <Link href="/" className="font-heading text-lg font-bold text-catsa-green">
          {sitio.nombre}
        </Link>
        <nav aria-label="Principal" className="hidden nav:block">
          <ul className="flex gap-7 text-sm font-semibold text-catsa-body">
            {navegacionSitio.map((enlace) => (
              <li key={enlace.href}>
                <Link href={enlace.href} className="transition-colors hover:text-catsa-green">
                  {enlace.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <MenuMovil />
      </Contenedor>
    </header>
  );
}
