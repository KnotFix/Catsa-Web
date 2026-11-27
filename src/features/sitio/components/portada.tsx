"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { video } from "../imagenes";

/**
 * Portada del inicio: el video de CATSA de fondo y el titular, que viene del
 * espacio editable "inicio.hero" del panel.
 *
 * Lo primero que se ve es el póster (una imagen optimizada por Next, el LCP).
 * El video se pide después de montar y aparece encima cuando ya corre. No se
 * reproduce con movimiento reducido ni con ahorro de datos: queda el póster.
 * En escritorio va en AV1 (o H.264 si el navegador no lo lee); en móvil, una
 * versión de 1280 px. El botón lo pausa (WCAG 2.2.2: lo que se mueve más de
 * 5 s se tiene que poder detener).
 */
const MENOS_MOVIMIENTO = "(prefers-reduced-motion: reduce)";

function suscribirPreferencias(avisar: () => void) {
  const consulta = window.matchMedia(MENOS_MOVIMIENTO);
  consulta.addEventListener("change", avisar);
  return () => consulta.removeEventListener("change", avisar);
}

function puedeReproducir() {
  const ahorro = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  return !window.matchMedia(MENOS_MOVIMIENTO).matches && !ahorro;
}

export function Portada({
  antetitulo,
  titulo,
  texto,
}: {
  antetitulo: string;
  titulo: string;
  texto: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const usarVideo = useSyncExternalStore(suscribirPreferencias, puedeReproducir, () => false);
  const [corriendo, setCorriendo] = useState(false);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (!usarVideo) return;
    ref.current?.play().catch(() => setPausado(true));
  }, [usarVideo]);

  function alternar() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => undefined);
      setPausado(false);
    } else {
      v.pause();
      setPausado(true);
    }
  }

  return (
    <>
      <div className="bg">
        <Image
          src={video.poster.src}
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="poster"
        />
        {usarVideo && (
          // Decorativo y sin sonido: no lleva subtítulos.
          <video
            ref={ref}
            className={cn(corriendo && "on")}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            onPlaying={() => setCorriendo(true)}
          >
            <source src={video.av1} type='video/mp4; codecs="av01.0.08M.10"' media="(min-width: 900px)" />
            <source src={video.grande} type="video/mp4" media="(min-width: 900px)" />
            <source src={video.movil} type="video/mp4" />
          </video>
        )}
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
      </div>
      {usarVideo && (
        <button
          type="button"
          className="pausa"
          onClick={alternar}
          aria-label={pausado ? "Reproducir el video de fondo" : "Pausar el video de fondo"}
        >
          <svg viewBox="0 0 24 24" aria-hidden fill="currentColor">
            {pausado ? <path d="M8 5.5v13l10.5-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
          </svg>
        </button>
      )}
    </>
  );
}
