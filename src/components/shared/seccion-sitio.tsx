import type { ReactNode } from "react";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";

/** Página de listado del sitio: encabezado del boceto y el contenido debajo. */
export function SeccionSitio({
  antetitulo,
  titulo,
  bajada,
  icono,
  children,
}: {
  antetitulo: string;
  titulo: string;
  bajada?: string;
  icono: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <CabeceraPagina antetitulo={antetitulo} titulo={titulo} bajada={bajada} icono={icono} />
      <section className="pb-24">
        <div className="wrap">{children}</div>
      </section>
    </>
  );
}
