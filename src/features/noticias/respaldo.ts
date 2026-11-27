/**
 * Foto para una noticia sin portada: fotografía de CATSA, siempre la misma para
 * la misma noticia (sale de su dirección). Cuando en el panel se le pone una
 * portada, se usa esa.
 */
const FOTOS = [
  { src: "/sitio/noticias/cosecha-carga.webp", alt: "Cosechadora cargando caña durante la zafra" },
  { src: "/sitio/noticias/planta-calderas.webp", alt: "Calderas de la planta de CATSA" },
  { src: "/sitio/noticias/riego-pivote.webp", alt: "Riego por pivote en un cañal" },
  { src: "/sitio/noticias/equipo-campo.webp", alt: "Colaboradores de CATSA revisando un terreno" },
  {
    src: "/sitio/noticias/tren-carretas-aereo.webp",
    alt: "Vista aérea de un tren de carretas entre los cañales",
  },
  {
    src: "/sitio/noticias/volcan-campos.webp",
    alt: "Campos de CATSA con los volcanes de Guanacaste al fondo",
  },
] as const;

export function fotoDeRespaldo(slug: string) {
  let n = 0;
  for (const c of slug) n = (n * 31 + c.charCodeAt(0)) >>> 0;
  return FOTOS[n % FOTOS.length];
}
