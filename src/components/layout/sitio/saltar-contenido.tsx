/** Enlace para usuarios de teclado: salta la navegación. Solo se ve con foco. */
export function SaltarContenido() {
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-3 focus:z-[400] focus:rounded-b-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-primary-foreground"
    >
      Saltar al contenido
    </a>
  );
}
