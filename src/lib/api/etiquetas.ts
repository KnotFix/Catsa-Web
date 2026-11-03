/**
 * Etiquetas de caché. Es un contrato con Catsa-Api: cuando Django publica algo,
 * llama a /api/revalidar con estas mismas etiquetas. Si se cambia una aquí,
 * se cambia también allá.
 */
export const etiquetas = {
  noticias: "noticias",
  noticia: (slug: string) => `noticia:${slug}`,
  puestos: "puestos",
  puesto: (slug: string) => `puesto:${slug}`,
  espacio: (clave: string) => `espacio:${clave}`,
  ajustes: "ajustes",
} as const;
