/**
 * Fotos del sitio público, servidas desde /public/sitio. Son las del sitio
 * actual de CATSA (catsa.net), copiadas en su mayor resolución disponible y
 * pasadas a WebP; ya no dependen de ese dominio. Se reemplazan cuando CATSA
 * entregue fotografía propia en buena resolución (bitácora, pendiente 8).
 * Cambiarlas aquí las cambia en todas las páginas.
 */
export type Foto = { src: string; alt: string; ancho: number; alto: number };

const foto = (ruta: string, alt: string, ancho: number, alto: number): Foto => ({
  src: `/sitio/${ruta}.webp`,
  alt,
  ancho,
  alto,
});

export const fotos = {
  // Portada y fondos
  campo: foto("portada/campo", "Tractor trabajando entre los surcos de caña", 1280, 720),
  planta: foto("portada/planta", "La planta de CATSA en Guardia de Liberia al atardecer", 1200, 793),
  fiesta: foto("portada/guanacastequidad", "Baile folclórico en la celebración de la Anexión", 1200, 700),
  camposAereo: foto("portada/campos-aereo", "Vista aérea de los cañales y la laguna de CATSA", 1920, 500),
  canalesAereo: foto("portada/canales-aereo", "Vista aérea de las plantaciones de caña", 1200, 477),

  // Empresa
  rotulo: foto("empresa/rotulo", "Colaboradores de CATSA junto al rótulo de la entrada", 1920, 1280),
  equipo: foto("empresa/equipo", "Equipo de colaboradores de CATSA", 556, 460),
  plantaAerea: foto("empresa/planta-aerea", "Vista aérea del ingenio de CATSA", 1200, 600),
  laboratorio: foto("empresa/laboratorio", "Colaboradoras empacando muestras en la planta", 1920, 1080),

  // Áreas
  administracion: foto("areas/administracion", "Oficinas del Área Administrativa de CATSA", 960, 638),
  agricola: foto("areas/agricola", "Cosechadora y carreta en un lote de caña", 960, 720),
  industrial: foto("areas/industrial", "Edificio de la fábrica de azúcar de CATSA", 960, 540),
  taller: foto("areas/taller", "Tractor del Taller de Maquinaria en el campo", 960, 638),
  maquinaria: foto("areas/maquinaria-agricola", "Maquinaria agrícola de CATSA en un cañal", 960, 540),
  refineria: foto("areas/refineria", "Edificio de la Refinería de CATSA", 1200, 650),
  destileria: foto("areas/destileria", "Torre de la Destilería de CATSA", 1200, 650),
  camion: foto("areas/taller-camion", "Cabezal del Taller de Maquinaria", 720, 480),
  siembra: foto("areas/siembra", "Corta manual de semilla de caña", 1024, 768),
  cosecha: foto("areas/cosecha", "Cosecha mecánica de caña", 320, 240),
  soca: foto("areas/soca", "Labores de cultivo en el ciclo de soca", 1280, 720),
  tallerInstalaciones: foto(
    "areas/taller-instalaciones",
    "Instalaciones del Taller de Maquinaria",
    1200,
    900,
  ),
  soldadura: foto("areas/soldadura", "Soldador del Taller de Maquinaria", 1920, 2880),

  // Productos
  azucarCrudo: foto("productos/azucar-crudo", "Azúcar crudo en una pala", 1000, 600),
  azucarBlanco: foto("productos/azucar-blanco", "Azúcar blanco en una cuchara de madera", 1000, 600),
  azucarE150: foto("productos/azucar-blanco-e150", "Azúcar blanco especial con terrones", 1000, 600),
  refinadoNacional: foto("productos/azucar-refinado-nacional", "Azúcar refinado en una cuchara", 1000, 600),
  refinadoExportacion: foto(
    "productos/azucar-refinado-exportacion",
    "Azúcar refinado de exportación",
    1000,
    600,
  ),
  refino35: foto("productos/azucar-refino-35ui", "Azúcar refino de alta pureza", 1000, 600),
  alcoholNeutro: foto("productos/alcohol-etilico-neutro", "Muestra de alcohol etílico neutro", 1000, 600),
  alcoholAnhidro: foto(
    "productos/alcohol-etilico-anhidro",
    "Medición de grado alcohólico del alcohol anhidro",
    1000,
    600,
  ),
  miel: foto("productos/miel", "Miel de caña", 1000, 600),
  arroz: foto("productos/arroz", "Arroz en grano", 1000, 600),
  arrozCampos: foto(
    "productos/arroz-campos",
    "Vista aérea de los campos de rotación arroz y caña",
    1200,
    793,
  ),

  // Responsabilidad social
  salud: foto("rse/salud", "Edificio de la ASADA de El Paso Tempisque", 550, 270),
  saludAsada: foto("rse/salud-asada", "Placa del terreno de la ASADA financiado por CATSA", 320, 240),
  educacion: foto("rse/educacion", "Estudiantes de escuelas vecinas en una actividad de CATSA", 550, 355),
  educacionLibros: foto(
    "rse/educacion-libros",
    "Estudiantes con sus libros del programa Libros para Todos",
    550,
    366,
  ),
  desarrolloComunal: foto(
    "rse/desarrollo-comunal",
    "Ermita de Nuestro Señor de la Agonía en Liberia",
    550,
    270,
  ),
  reforestacion: foto("rse/reforestacion", "Voluntarios sembrando árboles", 550, 270),
  voluntariado: foto("rse/voluntariado", "Grupo de voluntarios de Gente CATSA", 550, 270),

  // Ambiente
  rio: foto("ambiente/rio-tempisque", "El río Tempisque", 1200, 700),
  jabiru: foto("ambiente/jabiru", "Galán sin ventura (Jabiru mycteria) en su nido", 1200, 700),
  ciguena: foto("ambiente/ciguena", "Garzón (Mycteria americana)", 1200, 700),
  cocodrilo: foto("ambiente/cocodrilo", "Cocodrilo (Crocodylus acutus)", 1200, 700),
  pizote: foto("ambiente/pizote", "Pizote (Nasua narica)", 1200, 700),

  // Guanacastequidad
  comida: foto("guanacastequidad/comida", "Colaboradora con comidas típicas guanacastecas", 1200, 700),
  baile: foto("guanacastequidad/baile", "Baile típico en la celebración de la Anexión", 1200, 700),
  rancho: foto("guanacastequidad/rancho", "Rancho con comidas típicas", 1200, 700),
  tope: foto("guanacastequidad/tope", "Colaboradores en la barrera de la monta", 1200, 700),
  tradicion: foto("guanacastequidad/tradicion", "Colaborador rajando leña en la celebración", 1200, 700),
} as const;

export const sellos = [
  { clave: "iso-9001", nombre: "ISO 9001", src: "/sitio/sellos/iso-9001.png" },
  { clave: "fssc-22000", nombre: "FSSC 22000", src: "/sitio/sellos/fssc-22000.png" },
  { clave: "kosher", nombre: "Kosher", src: "/sitio/sellos/kosher.png" },
  { clave: "iscc", nombre: "ISCC", src: "/sitio/sellos/iscc.png" },
  { clave: "esencial", nombre: "Esencial Costa Rica", src: "/sitio/sellos/esencial.png" },
] as const;

/** Para fondos con CSS (tarjetas, mosaicos, parallax). */
export const fondo = (src: string) => ({ backgroundImage: `url('${src}')` });
