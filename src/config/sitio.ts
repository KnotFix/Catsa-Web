import type { Route } from "next";

export const sitio = {
  nombre: "CATSA",
  nombreLegal: "Central Azucarera Tempisque S.A.",
  descripcion:
    "Empresa agroindustrial guanacasteca dedicada al cultivo y procesamiento de caña de azúcar y a la producción de azúcares y alcoholes desde 1975.",
  ubicacion: "Filadelfia, Carrillo, Guanacaste, Costa Rica",
  certificaciones: "ISO 9001 · FSSC 22000 · Kosher · ISCC · Esencial Costa Rica",
} as const;

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
