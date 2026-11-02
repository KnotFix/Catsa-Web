import type { Esquemas, Imagen } from "@/lib/api/tipos";

export type NoticiaResumen = Esquemas["NoticiaResumen"];
export type Categoria = Esquemas["CategoriaPublica"];

/**
 * Bloques de contenido (bitácora D-013). El OpenAPI solo documenta `tipo`;
 * la forma de cada uno está en Catsa-Api: apps/noticias/bloques.py.
 */
export type Bloque =
  /** HTML ya limpio en Django (nh3). */
  | { tipo: "texto"; html: string }
  | { tipo: "cita"; texto: string; autor: string }
  | { tipo: "cifras"; items: { valor: string; etiqueta: string }[] }
  | { tipo: "imagen"; imagen: Imagen; pie: string };

export type Noticia = Omit<Esquemas["NoticiaPublica"], "bloques"> & { bloques: Bloque[] };
