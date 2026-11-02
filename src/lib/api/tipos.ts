import type { components } from "@/types/api";

/** Esquemas del OpenAPI de Catsa-Api. Se regeneran con `npm run api:tipos`. */
export type Esquemas = components["schemas"];

/** Respuesta paginada de DRF (PageNumberPagination). */
export type Pagina<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export const paginaVacia = <T>(): Pagina<T> => ({ count: 0, next: null, previous: null, results: [] });

/** Tamaño de página por defecto de Catsa-Api (apps/core/paginacion.py). */
export const POR_PAGINA = 12;

export type Imagen = Esquemas["Imagen"];
export type Pdf = Esquemas["Pdf"];
/** Paleta fija de etiquetas (categorías, áreas). Ver lib/colores.ts. */
export type Color = Esquemas["ColorEnum"];
