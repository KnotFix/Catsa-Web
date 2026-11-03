import type { Metadata } from "next";
import { EncabezadoSitio } from "@/components/layout/sitio/encabezado";
import { PieSitio } from "@/components/layout/sitio/pie";
import { SaltarContenido } from "@/components/layout/sitio/saltar-contenido";
import { openGraphSitio } from "@/features/contenido/ajustes";

// Imagen por defecto al compartir cualquier página que no traiga la suya (Ajustes del sitio).
export async function generateMetadata(): Promise<Metadata> {
  return { openGraph: await openGraphSitio() };
}

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
