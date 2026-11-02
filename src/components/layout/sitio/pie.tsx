import { Contenedor } from "@/components/shared/contenedor";
import { sitio } from "@/config/sitio";

export function PieSitio() {
  return (
    <footer className="bg-catsa-foot text-catsa-cream">
      <Contenedor className="py-10 text-sm">
        <p className="font-heading font-semibold">{sitio.nombreLegal}</p>
        <p className="mt-1 text-catsa-cream/70">{sitio.ubicacion}</p>
      </Contenedor>
    </footer>
  );
}
