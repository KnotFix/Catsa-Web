/**
 * Lo que devuelve una Server Action del panel. `campos` trae el error de cada
 * campo con el nombre que usa Django (`titulo`, `resumen`, `alt`…).
 */
export type Resultado<T = void> =
  { ok: true; datos: T } | { ok: false; error: string; campos?: Record<string, string> };
