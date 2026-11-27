"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fotos, type Foto } from "../imagenes";

type Area = {
  nombre: string;
  etiqueta: string;
  foto: Foto;
  texto: string;
  /** Una cifra que la resume, solo si está confirmada (sale de catsa.net). */
  cifra?: { valor: string; pie: string };
  temas: string[];
};

const foto = (ruta: string, alt: string, ancho: number, alto: number): Foto => ({
  src: `/sitio/areas-inicio/${ruta}.webp`,
  alt,
  ancho,
  alto,
});

// Textos de la página Nuestras áreas, resumidos para la portada.
const AREAS: Area[] = [
  {
    nombre: "Industrial",
    etiqueta: "Producción",
    foto: foto("planta-equipo", "Colaboradores de CATSA revisando equipo dentro de la planta", 1800, 1013),
    texto: "Molienda, refinería y destilería de alcohol en un tándem de seis molinos.",
    cifra: { valor: "7.500 t", pie: "de caña molida al día" },
    temas: ["Fabricación de azúcar", "Refinería", "Destilería"],
  },
  {
    nombre: "Agrícola",
    etiqueta: "Campo",
    foto: foto("cosechadora-atardecer", "Cosechadora de caña trabajando al atardecer", 1350, 1800),
    texto: "Siembra y cosecha de la caña, coordinada con cerca de 400 productores independientes.",
    cifra: { valor: "95 %", pie: "de la cosecha es mecánica" },
    temas: ["Preparación del terreno", "Siembra", "Cosecha mecánica"],
  },
  {
    nombre: "Administración",
    etiqueta: "Soporte",
    foto: fotos.administracion,
    texto:
      "Reclutamos al personal, administramos los recursos y cuidamos la relación con proveedores e instituciones.",
    temas: ["Talento", "Recursos", "Proveedores e instituciones"],
  },
  {
    nombre: "Taller",
    etiqueta: "Soporte técnico",
    foto: foto("tractor-polvo", "Tractor de CATSA preparando un terreno", 1800, 1200),
    texto: "Mantenimiento de la maquinaria agrícola, las cosechadoras, el equipo industrial y los vehículos.",
    temas: ["Mecánica", "Soldadura", "Mantenimiento"],
  },
];

/**
 * Nuestras áreas en la portada: cuatro paneles en fila. El que está bajo el
 * puntero (o tiene el foco) se abre y muestra su texto; los demás se angostan
 * y dejan ver solo el nombre. En táctil, el primer toque abre el panel y el
 * segundo lleva a la página. En móvil van uno debajo del otro.
 */
export function PanelesAreas() {
  const [abierto, setAbierto] = useState(0);
  const conMouse = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <div className="paneles">
      {AREAS.map((a, i) => {
        const activo = i === abierto;
        return (
          <Link
            key={a.nombre}
            href="/areas"
            className={cn("panel", activo && "abierto")}
            aria-label={`${a.nombre}: ${a.texto}`}
            onPointerEnter={() => conMouse() && setAbierto(i)}
            onFocus={() => setAbierto(i)}
            onClick={(e) => {
              if (!activo) {
                e.preventDefault();
                setAbierto(i);
              }
            }}
          >
            <Image
              src={a.foto.src}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 60vw"
              className="panel-foto"
            />
            <span className="panel-velo" aria-hidden />
            <span className="panel-n" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="panel-nombre-vertical" aria-hidden>
              {a.nombre}
            </span>
            <span className="panel-cuerpo" aria-hidden={!activo}>
              <span className="panel-etiqueta">{a.etiqueta}</span>
              <span className="panel-nombre">{a.nombre}</span>
              <span className="panel-texto">{a.texto}</span>
              {a.cifra && (
                <span className="panel-cifra">
                  <b>{a.cifra.valor}</b> {a.cifra.pie}
                </span>
              )}
              <span className="panel-temas">
                {a.temas.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </span>
              <span className="panel-ir">
                Conozca el área <span aria-hidden>→</span>
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
