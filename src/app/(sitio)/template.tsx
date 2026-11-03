import { ViewTransition } from "react";

/**
 * Entrada y salida entre páginas del sitio. El template se vuelve a montar en
 * cada navegación (el layout no), así que aquí sí se disparan enter y exit:
 * la página que se va sale rápido y la que llega sube con calma. Las clases
 * "pagina-sale" y "pagina-entra" están en sitio.css; la barra se queda quieta.
 * Sin soporte del navegador, la página cambia como siempre.
 */
export default function PlantillaSitio({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="pagina-entra" exit="pagina-sale" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
