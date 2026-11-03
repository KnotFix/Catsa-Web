"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { esGrupo, navegacionSitio, sitio } from "@/config/sitio";
import { cn } from "@/lib/utils";

/**
 * Barra flotante del boceto. En el inicio va en vidrio oscuro sobre la foto y
 * pasa a vidrio crema al bajar; en el resto de páginas es siempre crema. El
 * desplegable "Nosotros" abre con hover y con foco (CSS), así que funciona
 * con teclado y sin JavaScript. Debajo de 1040 px pasa a hamburguesa.
 *
 * La ruta es dato de la petición en las páginas dinámicas (una noticia, un
 * puesto): ahí la versión estática sale sin enlace activo y se completa al
 * llegar la ruta.
 */
export function EncabezadoSitio() {
  return (
    <Suspense fallback={<Barra ruta={null} />}>
      <BarraConRuta />
    </Suspense>
  );
}

function BarraConRuta() {
  return <Barra ruta={usePathname()} />;
}

function Barra({ ruta }: { ruta: string | null }) {
  const esInicio = ruta === "/";
  const [bajo, setBajo] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const barra = useRef<HTMLElement>(null);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!esInicio) return;
    const alMover = () => setBajo(window.scrollY > 40);
    alMover();
    window.addEventListener("scroll", alMover, { passive: true });
    return () => window.removeEventListener("scroll", alMover);
  }, [esInicio]);

  // El menú móvil se cierra al navegar, al tocar fuera y con Escape (devolviendo
  // el foco al botón, que si no queda perdido en una lista que ya no se ve).
  const [rutaAnterior, setRutaAnterior] = useState(ruta);
  if (ruta !== rutaAnterior) {
    setRutaAnterior(ruta);
    setAbierto(false);
  }
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => {
      if (!barra.current?.contains(e.target as Node)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAbierto(false);
      boton.current?.focus();
    };
    document.addEventListener("click", fuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("click", fuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [abierto]);

  const activo = (href: string) => ruta !== null && (ruta === href || ruta.startsWith(`${href}/`));

  return (
    <header
      ref={barra}
      className={cn(
        "nav-sitio",
        esInicio && !bajo ? "nav-hero" : "scrolled",
        !esInicio && "solid",
        abierto && "open",
      )}
    >
      <div className="navbar">
        <Link href="/" className="brand">
          {sitio.nombre}
          <small>Central Azucarera Tempisque</small>
        </Link>
        <button
          ref={boton}
          type="button"
          className="nav-toggle"
          aria-label="Menú"
          aria-expanded={abierto}
          aria-controls="navegacion-principal"
          onClick={() => setAbierto((a) => !a)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav id="navegacion-principal" className="navlinks" aria-label="Principal">
          {navegacionSitio.map((entrada) =>
            esGrupo(entrada) ? (
              <div key={entrada.titulo} className="dropdown">
                <button type="button" className={cn(entrada.enlaces.some((e) => activo(e.href)) && "active")}>
                  {entrada.titulo}
                  <span className="caret" aria-hidden>
                    ▾
                  </span>
                </button>
                <div className="dropdown-menu">
                  <div className="inner">
                    {entrada.enlaces.map((e) => (
                      <Link key={e.href} href={e.href} aria-current={activo(e.href) ? "page" : undefined}>
                        {e.titulo}
                        <small>{e.descripcion}</small>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={entrada.href}
                href={entrada.href}
                aria-current={activo(entrada.href) ? "page" : undefined}
                className={cn("navlink", activo(entrada.href) && "active", entrada.nuevo && "nav-new")}
              >
                {entrada.titulo}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
