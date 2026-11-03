import type { Route } from "next";

export const sitio = {
  nombre: "CATSA",
  nombreLegal: "Central Azucarera Tempisque S.A.",
  descripcion:
    "Empresa agroindustrial guanacasteca dedicada al cultivo y procesamiento de caña de azúcar y a la producción de azúcares y alcoholes desde 1975.",
  ubicacion: "Guardia de Liberia, Guanacaste, Costa Rica",
  certificaciones: "ISO 9001 · FSSC 22000 · Kosher · ISCC · Esencial Costa Rica",
  /** Formulario de sugerencias o quejas que CATSA ya publica en catsa.net. */
  sugerencias:
    "https://docs.google.com/forms/d/e/1FAIpQLSczcOhSYTT9ZRketIhdPWG9WmeeF4_nn0O1XqOG5M9Y0vdMwg/viewform",
} as const;

/** Las dos sedes que publica catsa.net. */
export const sedes = [
  {
    nombre: "Planta",
    direccion: "6,5 km al sureste de la Escuela de Guardia, Liberia, Guanacaste.",
    apartado: "Apartado 56-5000, Liberia",
    telefono: "+506 2690-2500",
    mapa: "Central Azucarera Tempisque, Guardia, Liberia, Guanacaste",
  },
  {
    nombre: "Oficinas en San José",
    direccion: "125 m al sur de Teletica, Edificio Vista del Parque, 2.º piso.",
    apartado: "Apartado 10315-1000, San José",
    telefono: "+506 2291-2676",
    mapa: "Edificio Vista del Parque, San José, Costa Rica",
  },
] as const;

type Enlace = { titulo: string; href: Route; descripcion?: string; nuevo?: boolean };
type Grupo = { titulo: string; enlaces: Enlace[] };

/** Menú principal del boceto aprobado: "Nosotros" se despliega, el resto va directo. */
export const navegacionSitio: (Enlace | Grupo)[] = [
  {
    titulo: "Nosotros",
    enlaces: [
      { titulo: "Sobre nosotros", href: "/sobre-nosotros", descripcion: "Quiénes somos y nuestra historia" },
      { titulo: "Nuestras áreas", href: "/areas", descripcion: "Las áreas que forman CATSA" },
      {
        titulo: "Cómo trabajamos",
        href: "/como-trabajamos",
        descripcion: "Las fases de producción del azúcar",
      },
      {
        titulo: "Certificaciones",
        href: "/certificaciones",
        descripcion: "Los sellos que respaldan cada grano",
      },
    ],
  },
  { titulo: "Productos", href: "/productos" },
  { titulo: "RSE", href: "/rse" },
  { titulo: "Noticias", href: "/noticias", nuevo: true },
  { titulo: "Puestos", href: "/puestos", nuevo: true },
  { titulo: "Contáctenos", href: "/contacto" },
];

export const esGrupo = (e: Enlace | Grupo): e is Grupo => "enlaces" in e;

/** Columnas del pie. */
export const pieSitio: Grupo[] = [
  {
    titulo: "Empresa",
    enlaces: [
      { titulo: "Sobre nosotros", href: "/sobre-nosotros" },
      { titulo: "Nuestras áreas", href: "/areas" },
      { titulo: "Cómo trabajamos", href: "/como-trabajamos" },
      { titulo: "Certificaciones", href: "/certificaciones" },
      { titulo: "RSE", href: "/rse" },
    ],
  },
  {
    titulo: "Productos",
    enlaces: [
      { titulo: "Azúcares", href: "/productos#azucares" as Route },
      { titulo: "Alcoholes", href: "/productos#alcoholes" as Route },
      { titulo: "Miel", href: "/productos#miel" as Route },
    ],
  },
  {
    titulo: "Más",
    enlaces: [
      { titulo: "Noticias", href: "/noticias" },
      { titulo: "Puestos", href: "/puestos" },
      { titulo: "Contáctenos", href: "/contacto" },
    ],
  },
];
