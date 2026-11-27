"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";

/**
 * Luz que sigue al puntero sobre las tarjetas `.foco` de adentro (el sombreado
 * de las certificaciones). Escribe en cada tarjeta --fx y --fy, la posición del
 * puntero respecto a ella, y el CSS de sitio.css dibuja el brillo. Una sola
 * escucha para todo el grupo, así la luz pasa de una tarjeta a la vecina.
 * En pantallas táctiles no hace nada: queda la sombra fija.
 */
export function Foco(props: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grupo = ref.current;
    if (!grupo || !window.matchMedia("(hover: hover)").matches) return;
    let pendiente = false;
    let x = 0;
    let y = 0;
    const mover = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        grupo.querySelectorAll<HTMLElement>(".foco").forEach((t) => {
          const r = t.getBoundingClientRect();
          t.style.setProperty("--fx", `${(x - r.left).toFixed(0)}px`);
          t.style.setProperty("--fy", `${(y - r.top).toFixed(0)}px`);
        });
        pendiente = false;
      });
    };
    grupo.addEventListener("pointermove", mover);
    return () => grupo.removeEventListener("pointermove", mover);
  }, []);

  return <div ref={ref} {...props} />;
}
