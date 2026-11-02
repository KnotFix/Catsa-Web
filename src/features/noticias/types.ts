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

// --- Panel ------------------------------------------------------------------

export type EstadoNoticia = Esquemas["EstadoNoticia"];
export type NoticiaPanel = Esquemas["NoticiaPanel"];
export type CategoriaPanel = Esquemas["Categoria"];
/** Lo que guarda el panel. Las imágenes van como id del medio (apps/noticias/bloques.py). */
export type BloqueEntrada =
  Extract<Bloque, { tipo: "texto" | "cita" | "cifras" }> | { tipo: "imagen"; medio: number; pie: string };
export type NoticiaDetallePanel = Omit<Esquemas["NoticiaDetallePanel"], "bloques"> & {
  bloques: BloqueEntrada[];
};
export type NoticiaEntrada = {
  titulo: string;
  resumen: string;
  autor: string;
  categoria: number | null;
  portada: number | null;
  bloques: BloqueEntrada[];
};

export const estadosNoticia: Record<EstadoNoticia, string> = {
  borrador: "Borrador",
  publicada: "Publicada",
  archivada: "Archivada",
};
