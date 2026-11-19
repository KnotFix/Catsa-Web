import type { Metadata } from "next";
import Link from "next/link";
import { EncabezadoSitio } from "@/components/layout/sitio/encabezado";
import { PieSitio } from "@/components/layout/sitio/pie";
import { Button } from "@/components/ui/button";
import "./(sitio)/sitio.css";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

// Vive en la raíz (atrapa cualquier dirección que no existe), así que no
// hereda el layout del sitio: trae su barra y su pie para que el visitante
// pueda seguir navegando en vez de quedar en una página suelta.
export default function NoEncontrada() {
  return (
    <>
      <EncabezadoSitio />
      <main
        id="contenido"
        className="flex flex-1 flex-col items-center justify-center px-7 pt-40 pb-24 text-center"
      >
        <p className="text-xs font-semibold tracking-[0.16em] text-catsa-green uppercase">Error 404</p>
        <h1 className="mt-3 text-3xl text-catsa-ink">No encontramos esta página</h1>
        <p className="mt-3 text-catsa-body">Puede que se haya movido o que el enlace esté incompleto.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contacto">Contáctenos</Link>
          </Button>
        </div>
      </main>
      <PieSitio />
    </>
  );
}
