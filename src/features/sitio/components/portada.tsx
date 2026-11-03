"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fondo, fotos } from "../imagenes";
import { PRODUCTOS } from "../productos";

const FOTOS = [fotos.campo, fotos.planta, fotos.fiesta];

/**
 * Portada del inicio: tres fotos que se turnan cada 5 s (sin turno si se
 * pidió menos movimiento) y el titular, que viene del espacio editable
 * "inicio.hero" del panel.
 */
export function Portada({
  antetitulo,
  titulo,
  texto,
}: {
  antetitulo: string;
  titulo: string;
  texto: string;
}) {
  const [actual, setActual] = useState(0);
  const turno = useRef<number | undefined>(undefined);

  const programar = useCallback(() => {
    window.clearInterval(turno.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    turno.current = window.setInterval(() => setActual((i) => (i + 1) % FOTOS.length), 5000);
  }, []);

  useEffect(() => {
    programar();
    return () => window.clearInterval(turno.current);
  }, [programar]);

  return (
    <>
      <div className="bg">
        {FOTOS.map((f, i) => (
          <Image
            key={f.src}
            src={f.src}
            alt={i === actual ? f.alt : ""}
            fill
            sizes="100vw"
            priority={i === 0}
            className={cn(i === actual && "on")}
          />
        ))}
        <div className="veil" />
      </div>
      <div className="inner">
        <p className="eyebrow">{antetitulo}</p>
        <h1>{titulo}</h1>
        <p className="sub">{texto}</p>
        <div className="btns">
          <Link className="btn btn-primary" href="/productos">
            Conozca nuestros productos
          </Link>
          <Link className="btn btn-ondark" href="/sobre-nosotros">
            Quiénes somos
          </Link>
        </div>
        <div className="dots">
          {FOTOS.map((f, i) => (
            <button
              key={f.src}
              type="button"
              aria-label={`Foto ${i + 1}`}
              aria-pressed={i === actual}
              className={cn(i === actual && "on")}
              onClick={() => {
                setActual(i);
                programar();
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

const DESTACADOS = ["azucar-refinado-nacional", "alcohol-etilico-neutro", "azucar-crudo", "miel"].map(
  (slug) => PRODUCTOS.find((p) => p.slug === slug)!,
);

/**
 * "Productos seleccionados": cada foto se destapa al entrar en pantalla y se
 * vuelve a tapar al salir (en los dos sentidos del scroll).
 */
export function Escaparate() {
  const lista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = lista.current?.querySelectorAll(".sc-item");
    if (!items) return;
    const io = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.target.classList.toggle("on", e.isIntersecting)),
      { threshold: 0.28 },
    );
    items.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, []);

  return (
    <div className="sc-stream" ref={lista}>
      {DESTACADOS.map((p, i) => (
        <Link
          key={p.nombre}
          className={cn("sc-item", i % 2 === 1 && "portrait")}
          href={`/productos#${p.slug}` as Route}
        >
          <div className="reveal-img">
            <div className="ri-bg" style={fondo(p.foto.src)} role="img" aria-label={p.foto.alt} />
          </div>
          <div className="sc-cap">
            <span className="ci">{String(i + 1).padStart(2, "0")}</span>
            <span className="cn">{p.nombre}</span>
            <span className="cc">{p.categoria}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
