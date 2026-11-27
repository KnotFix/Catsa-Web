"use client";

import { useEffect, useRef, useState } from "react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PRODUCTOS } from "../productos";

const DESTACADOS = ["azucar-refinado-nacional", "alcohol-etilico-neutro", "azucar-crudo", "miel"].map(
  (slug) => PRODUCTOS.find((p) => p.slug === slug)!,
);

/**
 * "Productos seleccionados" del inicio. En escritorio, la foto queda fija a la
 * derecha mientras la lista pasa a la izquierda: el producto que llega al
 * centro de la pantalla destapa su foto desde abajo y el anterior se va hacia
 * arriba (y al revés al subir). En móvil, sin JavaScript o con movimiento
 * reducido, cada producto lleva su propia foto y no hay escenario fijo.
 *
 * Profundidad (escritorio, sin movimiento reducido): la foto activa se desliza
 * dentro del marco según cuánto se ha avanzado en la sección (--avance, de 0 a
 * 1) y detrás del marco queda un halo desenfocado del mismo producto.
 */
export function Escaparate() {
  const raiz = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLOListElement>(null);
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const items = lista.current?.querySelectorAll<HTMLElement>("[data-indice]");
    if (!items) return;
    // Una franja de 1 px en el centro de la pantalla: el que la cruza manda.
    const io = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) setActivo(Number((e.target as HTMLElement).dataset.indice));
        }),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    items.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = raiz.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let pendiente = false;
    const medir = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const alto = window.innerHeight;
        const avance = Math.min(1, Math.max(0, (alto - r.top) / (r.height + alto)));
        el.style.setProperty("--avance", avance.toFixed(4));
        pendiente = false;
      });
    };
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      window.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
    };
  }, []);

  return (
    <div className="esc" ref={raiz}>
      <ol className="esc-lista" ref={lista}>
        {DESTACADOS.map((p, i) => (
          <li
            key={p.slug}
            data-indice={i}
            className={cn("esc-item", i === activo && "activo")}
            aria-current={i === activo || undefined}
          >
            <div className="esc-foto-movil" data-reveal="foto">
              <Image src={p.foto.src} alt={p.foto.alt} fill sizes="(max-width: 900px) 100vw, 1px" />
            </div>
            <p className="esc-meta">
              <span className="esc-n">{String(i + 1).padStart(2, "0")}</span>
              <span>{p.categoria}</span>
              {p.codigo && <span className="esc-cod">{p.codigo}</span>}
            </p>
            <h3 className="esc-nombre">{p.nombre}</h3>
            <p className="esc-desc">{p.descripcion}</p>
            <Link className="esc-ir" href={`/productos/${p.slug}` as Route}>
              Ver ficha técnica <span aria-hidden>→</span>
            </Link>
          </li>
        ))}
      </ol>

      {/* Decorativo: la misma foto ya está (con su texto alternativo) en cada producto. */}
      <div className="esc-escenario" aria-hidden>
        <div className="esc-fijo">
          <div className="esc-halo">
            {DESTACADOS.map((p, i) => (
              <Image
                key={p.slug}
                src={p.foto.src}
                alt=""
                fill
                sizes="(max-width: 900px) 1px, 20vw"
                className={cn(i === activo && "on")}
              />
            ))}
          </div>
          <div className="esc-marco">
            {DESTACADOS.map((p, i) => (
              <div key={p.slug} className={cn("esc-capa", i < activo && "salio", i === activo && "activa")}>
                <div className="esc-px">
                  <Image src={p.foto.src} alt="" fill sizes="(max-width: 900px) 1px, 46vw" />
                </div>
              </div>
            ))}
            <div className="esc-contador">
              <span>{String(activo + 1).padStart(2, "0")}</span>
              <span className="esc-barra">
                <span style={{ transform: `scaleX(${(activo + 1) / DESTACADOS.length})` }} />
              </span>
              <span>{String(DESTACADOS.length).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
