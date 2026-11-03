/**
 * Fotos del sitio público. Por ahora son las del sitio actual de CATSA, las
 * mismas del boceto aprobado; se reemplazan cuando CATSA entregue fotografía
 * propia en buena resolución (bitácora, pendiente 8). Cambiarlas aquí las
 * cambia en todas las páginas.
 *
 * Ojo al publicar: si el sitio nuevo reemplaza al de catsa.net, estas rutas
 * de WordPress dejan de existir. Antes de eso hay que copiarlas a la
 * biblioteca o a /public.
 */
const WP = "https://www.catsa.net/wp-content/uploads";

export const fotos = {
  canales: { src: `${WP}/2018/11/slide03-2.jpg`, alt: "Cañales de CATSA en Guanacaste" },
  planta: { src: `${WP}/2018/11/main-slide02.jpg`, alt: "Procesamiento industrial de caña" },
  operacion: { src: `${WP}/2018/11/slide03.jpg`, alt: "Operación de CATSA en Guanacaste" },
  comunidad: {
    src: `${WP}/2018/10/quienes-somos-02-1024x407.jpg`,
    alt: "Comunidad y colaboradores de CATSA",
  },
  administracion: {
    src: `${WP}/2017/02/administrativa01-450x400.jpg`,
    alt: "Área de Administración de CATSA",
  },
  agricola: { src: `${WP}/2017/02/servicios-agricola-450x400.jpg`, alt: "Área Agrícola de CATSA" },
  industrial: { src: `${WP}/2017/02/industrial01-450x400.jpg`, alt: "Área Industrial de CATSA" },
  taller: {
    src: `${WP}/2017/02/taller-y-mantenimiento01-450x400.jpg`,
    alt: "Área de Taller y Mantenimiento de CATSA",
  },
  azucar: { src: `${WP}/2017/02/azucar-blanco01.jpg`, alt: "Azúcar de CATSA" },
  alcohol: { src: `${WP}/2017/02/alcohol-etilico-anhidro01.jpg`, alt: "Alcohol etílico de CATSA" },
  miel: { src: `${WP}/2025/04/imagen_redimensionada_1000x600.png`, alt: "Miel de caña de CATSA" },
} as const;

export const sellos = [
  { clave: "iso-9001", nombre: "ISO 9001", src: `${WP}/2025/05/Sello-ICONTEC_ISO-9001.png` },
  { clave: "fssc-22000", nombre: "FSSC 22000", src: `${WP}/2025/05/FSSCC-22000.png` },
  { clave: "kosher", nombre: "Kosher", src: `${WP}/2025/05/kosher.jpg` },
  { clave: "iscc", nombre: "ISCC", src: `${WP}/2025/05/isccl.png` },
  { clave: "esencial", nombre: "Esencial Costa Rica", src: `${WP}/2025/05/Esencial-CR.png` },
] as const;

/** Para fondos con CSS (tarjetas, mosaicos, parallax). */
export const fondo = (src: string) => ({ backgroundImage: `url('${src}')` });
