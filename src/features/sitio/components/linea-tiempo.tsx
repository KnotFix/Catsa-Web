"use client";

import { useEffect, useRef } from "react";
import { Titular } from "@/components/sitio/titular";
import { fondo } from "../imagenes";

export type Hito = { anio: string; antetitulo: string; titulo: string; texto: string; foto: string };

/**
 * Historia de Sobre nosotros: la línea se rellena al bajar y cada nodo se
 * enciende cuando cruza el centro de la pantalla, soltando su tarjeta.
 */
export function LineaTiempo({ hitos }: { hitos: Hito[] }) {
  const linea = useRef<HTMLDivElement>(null);
  const relleno = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = linea.current;
    const barra = relleno.current;
    if (!tl || !barra) return;
    const items = [...tl.querySelectorAll<HTMLElement>(".tl-item")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((it) => it.classList.add("on"));
      barra.style.height = "calc(100% - 24px)";
      return;
    }
    let pendiente = false;
    const actualizar = () => {
      const r = tl.getBoundingClientRect();
      const centro = window.innerHeight * 0.52;
      const total = tl.offsetHeight - 24;
      barra.style.height = `${Math.max(0, Math.min(total, centro - (r.top + 12)))}px`;
      for (const it of items) {
        const nodo = it.querySelector(".tl-node")!.getBoundingClientRect();
        it.classList.toggle("on", nodo.top + nodo.height / 2 < centro + 10);
      }
      pendiente = false;
    };
    const alMover = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(actualizar);
    };
    actualizar();
    window.addEventListener("scroll", alMover, { passive: true });
    window.addEventListener("resize", alMover);
    return () => {
      window.removeEventListener("scroll", alMover);
      window.removeEventListener("resize", alMover);
    };
  }, []);

  return (
    <div className="timeline" ref={linea}>
      <div className="tl-rail" />
      <div className="tl-fill" ref={relleno} />
      {hitos.map((h, i) => (
        <div key={h.anio} className={`tl-item ${i % 2 ? "right" : "left"}`}>
          <div className="tl-node" />
          <div className="tl-card">
            <div className="cimg" style={fondo(h.foto)}>
              <span className="cy">{h.anio}</span>
            </div>
            <div className="cbody">
              <div className="tl-ey">{h.antetitulo}</div>
              <Titular como="h3" texto={h.titulo} retardo={120} />
              <p>{h.texto}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
