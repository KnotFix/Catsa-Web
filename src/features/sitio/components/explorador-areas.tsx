"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { fotos } from "../imagenes";

const AREAS = [
  {
    nombre: "Administración",
    etiqueta: "Soporte",
    foto: fotos.administracion,
    texto:
      "La plataforma de soporte de toda la organización. Reclutamos al personal idóneo, administramos los recursos de la empresa y cuidamos la relación con proveedores, organizaciones e instituciones públicas.",
    temas: ["Reclutamiento y talento", "Administración de recursos", "Proveedores e instituciones"],
  },
  {
    nombre: "Agrícola",
    etiqueta: "Campo",
    foto: fotos.agricola,
    texto:
      "Maneja nuestras plantaciones y coordina la producción de los productores independientes de la zona. La zafra va de diciembre a principios de abril y el 95 % de la cosecha es mecánica.",
    temas: [
      "Preparación del terreno",
      "Siembra y ciclos de planta y soca",
      "Cosecha mecánica",
      "Investigación de variedades",
    ],
  },
  {
    nombre: "Industrial",
    etiqueta: "Producción",
    foto: fotos.industrial,
    texto:
      "Molemos 7.500 toneladas de caña al día en un tándem de seis molinos. La refinería produce 3.600 bultos de 50 kg de azúcar refino al día y la destilería, 250.000 litros de alcohol.",
    temas: ["Fabricación de azúcar", "Refinería", "Destilería", "Vapor y energía con bagazo"],
  },
  {
    nombre: "Taller y Mantenimiento",
    etiqueta: "Soporte técnico",
    foto: fotos.taller,
    texto:
      "Mantenimiento preventivo y correctivo de la maquinaria agrícola, las cosechadoras, la maquinaria industrial, el equipo de riego y los vehículos. Al terminar la zafra, cada equipo recibe mantenimiento total.",
    temas: ["Sección Mecánica", "Sección Soldadura", "Sección Mantenimiento", "Sección Administrativa"],
  },
];

/**
 * Pestañas de Nuestras áreas: la lista a la izquierda, la foto que cambia a la
 * derecha y el detalle debajo. Con mouse cambia al pasar por encima; en
 * táctil, al tocar. Las flechas recorren las pestañas (patrón ARIA de tabs).
 */
export function ExploradorAreas() {
  const [activa, setActiva] = useState(0);
  const pestanas = useRef<(HTMLButtonElement | null)[]>([]);

  // En táctil, el "hover" llega junto con el toque: solo se usa con mouse.
  const alPasar = (i: number) => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setActiva(i);
  };

  function conTeclado(e: React.KeyboardEvent, i: number) {
    const paso = ["ArrowDown", "ArrowRight"].includes(e.key)
      ? 1
      : ["ArrowUp", "ArrowLeft"].includes(e.key)
        ? -1
        : 0;
    if (!paso) return;
    e.preventDefault();
    const siguiente = (i + paso + AREAS.length) % AREAS.length;
    setActiva(siguiente);
    pestanas.current[siguiente]?.focus();
  }

  return (
    <div className="ar-grid" data-reveal>
      <div className="ar-list" role="tablist" aria-label="Áreas de CATSA">
        {AREAS.map((a, i) => (
          <button
            key={a.nombre}
            ref={(el) => {
              pestanas.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`area-pestana-${i}`}
            aria-controls={`area-panel-${i}`}
            aria-selected={i === activa}
            tabIndex={i === activa ? 0 : -1}
            className="ar-tab"
            onClick={() => setActiva(i)}
            onMouseEnter={() => alPasar(i)}
            onKeyDown={(e) => conTeclado(e, i)}
          >
            <span className="n">{String(i + 1).padStart(2, "0")}</span>
            <span className="t">{a.nombre}</span>
          </button>
        ))}
      </div>

      <div className="ar-photo">
        {AREAS.map((a, i) => (
          <Image
            key={a.nombre}
            src={a.foto.src}
            alt={a.foto.alt}
            fill
            sizes="(max-width: 900px) 100vw, 560px"
            priority={i === 0}
            className={cn(i === activa && "on")}
          />
        ))}
      </div>

      <div className="ar-panels">
        {AREAS.map((a, i) => (
          <div
            key={a.nombre}
            id={`area-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`area-pestana-${i}`}
            hidden={i !== activa}
            className={cn("ar-body", i === activa && "on")}
          >
            <span className="tag">{a.etiqueta}</span>
            <p>{a.texto}</p>
            <ul>
              {a.temas.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
