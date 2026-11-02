import { EncabezadoSitio } from "@/components/layout/sitio/encabezado";
import { PieSitio } from "@/components/layout/sitio/pie";
import { SaltarContenido } from "@/components/layout/sitio/saltar-contenido";

// Sitio público. El grupo (sitio) no aparece en la URL.
export default function SitioLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SaltarContenido />
      <EncabezadoSitio />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <PieSitio />
    </>
  );
}
