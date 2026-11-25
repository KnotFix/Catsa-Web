import "server-only";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { sitio } from "@/config/sitio";
import { etiquetas } from "@/lib/api/etiquetas";
import { apiFetch } from "@/lib/api/http";
import { conRespaldo } from "@/lib/api/respaldo";
import type { Ajustes } from "./types";

const vacios: Ajustes = {
  telefono: "",
  whatsapp: "",
  correo: "",
  direccion: "",
  horario: "",
  facebook: "",
  linkedin: "",
  instagram: "",
  youtube: "",
  imagen_compartir: null,
};

/**
 * Ajustes del sitio (contacto, horario, redes, imagen para compartir). Se
 * editan en Administración y cambian en todo el sitio a la vez. Lo vacío no
 * se muestra; si la API no responde, el sitio sale sin esos datos.
 */
export async function obtenerAjustes(): Promise<Ajustes> {
  "use cache";
  cacheTag(etiquetas.ajustes);
  cacheLife("days");
  // Se lee en el layout (pie y metadatos), fuera de Suspense.
  return conRespaldo(() => apiFetch<Ajustes>("/api/contenido/ajustes/"), vacios, { vida: "minutes" });
}

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/**
 * Si nadie eligió una imagen en Ajustes, el enlace igual sale con foto en
 * Facebook, LinkedIn y WhatsApp. JPG de 1200 × 630, la medida que piden.
 */
const IMAGEN_RESPALDO = {
  url: "/sitio/compartir.jpg",
  alt: "La planta de CATSA en Guardia de Liberia al atardecer",
  width: 1200,
  height: 630,
};

/**
 * Next reemplaza `openGraph` entero cuando una página define el suyo, así que
 * cada página parte de aquí: nombre del sitio, idioma y la imagen por defecto
 * si la página no trae una propia.
 */
export async function openGraphSitio(propio: OpenGraph = {}): Promise<OpenGraph> {
  const { imagen_compartir: imagen } = await obtenerAjustes();
  const porDefecto = [
    imagen
      ? {
          url: imagen.url,
          alt: imagen.alt,
          width: imagen.ancho ?? undefined,
          height: imagen.alto ?? undefined,
        }
      : IMAGEN_RESPALDO,
  ];
  return {
    siteName: sitio.nombre,
    locale: "es_CR",
    type: "website",
    ...propio,
    images: propio.images ?? porDefecto,
  } as OpenGraph;
}
