import type { Imagen } from "@/lib/api/tipos";

// Provisional, escrito a mano. Cuando Catsa-Api publique el endpoint se
// reemplaza por el tipo generado del OpenAPI (npm run api:tipos).
export type NoticiaResumen = {
  slug: string;
  titulo: string;
  resumen: string;
  portada: Imagen | null;
  publicada_en: string;
};

export type Noticia = NoticiaResumen & {
  /** HTML ya sanitizado por Django. */
  cuerpo: string;
};
