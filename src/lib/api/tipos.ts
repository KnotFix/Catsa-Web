/** Respuesta paginada de DRF (PageNumberPagination). */
export type Pagina<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export const paginaVacia = <T>(): Pagina<T> => ({ count: 0, next: null, previous: null, results: [] });

export type Imagen = {
  url: string;
  alt: string;
  ancho: number | null;
  alto: number | null;
};
