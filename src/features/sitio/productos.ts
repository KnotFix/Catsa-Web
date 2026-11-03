import { fotos, type Foto } from "./imagenes";

/**
 * Catálogo de productos. Contenido fijo por alcance (la bitácora deja el
 * catálogo fuera del panel: los cambios se atienden por mantenimiento).
 *
 * Códigos, nombres y especificaciones son los de las fichas publicadas en
 * catsa.net. Ahí las páginas de los dos alcoholes tienen el contenido cruzado
 * y ambas dicen LB-2401; aquí el neutro es LB-2401 (96,1 °GL) y el anhidro
 * LB-2402, el código que lleva la dirección de su página.
 */

export type Categoria = "Azúcares" | "Alcoholes" | "Miel" | "Arroz";

export type Certificacion = "ISO 9001" | "FSSC 22000" | "Kosher";

export type Producto = {
  /** Ancla en /productos#…, dirección de la ficha y orden del explorador. */
  slug: string;
  categoria: Categoria;
  nombre: string;
  codigo?: string;
  otrosNombres?: string;
  foto: Foto;
  descripcion: string;
  etiquetas: string[];
  /** Según el alcance de cada certificado publicado en Gestión de Calidad. */
  certificaciones: Certificacion[];
  ficha?: Ficha;
};

/** Una fila de especificación. `texto` ocupa mínimo y máximo (Negativo, Estándar…). */
export type Fila = {
  descripcion: string;
  unidad: string;
  minimo?: string;
  maximo?: string;
  texto?: string;
  metodo?: string;
};

export type Tabla = { titulo: string; frecuencia?: string; filas: Fila[] };

export type Organoleptica = {
  nombre: "Color" | "Olor" | "Sabor" | "Textura" | "Apariencia";
  valor: string;
};

export type Ficha = {
  organolepticas: Organoleptica[];
  /** Cuatro datos para la franja de la ficha. */
  destacados: { valor: string; unidad?: string; texto: string }[];
  tablas: Tabla[];
  notas?: { titulo: string; texto: string }[];
  presentacion: string[];
  granel?: Granel;
};

export type Granel = {
  cisterna: string;
  tanques: { millones: string; nombre: string }[];
  almacenamientoTotal: string;
};

// —— Bloques que se repiten tal cual en varias fichas ——

const ORGANOLEPTICAS_BLANCO: Organoleptica[] = [
  { nombre: "Textura", valor: "Sólida granular" },
  { nombre: "Olor", valor: "Aroma característico del azúcar" },
  { nombre: "Sabor", valor: "Dulce característico" },
  { nombre: "Apariencia", valor: "Sólido cristalino color blanco" },
];

const MICROBIOLOGICAS: Tabla = {
  titulo: "Especificaciones microbiológicas",
  frecuencia: "Mínimo una vez por año",
  filas: [
    { descripcion: "Bacteria mesofílica", unidad: "UFC / 10 g", maximo: "200" },
    { descripcion: "Moho", unidad: "UFC / 10 g", maximo: "10" },
    { descripcion: "Levaduras", unidad: "UFC / 10 g", maximo: "10" },
  ],
};

const METALES: Tabla = {
  titulo: "Metales pesados",
  frecuencia: "Mínimo una vez por año",
  filas: [
    { descripcion: "Plomo", unidad: "mg/kg", maximo: "0,5" },
    { descripcion: "Arsénico", unidad: "mg/kg", maximo: "1,0" },
    { descripcion: "Cobre", unidad: "mg/kg", maximo: "1,5" },
  ],
};

const NOTAS_AZUCAR = [
  {
    titulo: "Alérgenos",
    texto: "Declaración del ingenio de que no contiene. No se utilizan organismos genéticamente modificados.",
  },
  { titulo: "Plaguicidas", texto: "Una vez al año. Pesticidas totales: menos de 5 µg/kg." },
  { titulo: "Trazabilidad", texto: "Número de trazabilidad en cada unidad de empaque." },
  { titulo: "Certificado de calidad", texto: "Con cada entrega." },
];

const SACOS = "Sacos de polipropileno con liner interno de polietileno, de 50 kg.";
const BIG_BAGS = "Big bags de polipropileno con liner interno de polietileno, de 1.000 kg.";
const EMPAQUE_LIMPIO = "Empaque libre de humedad, suciedad, manchas o plagas.";

const GRANEL_ALCOHOL: Granel = {
  cisterna: "30.000 – 35.000 L",
  tanques: [
    { millones: "9,7", nombre: "Tanques de almacenamiento CATSA" },
    { millones: "6,7", nombre: "Tanque N.º 105 · Punta Morales" },
    { millones: "8,7", nombre: "Tanque N.º 107 · Punta Morales" },
    { millones: "8,3", nombre: "Tanque N.º 109 · Punta Morales" },
  ],
  almacenamientoTotal: "33,4",
};

/** Tabla técnica de los refinos: cambian el color, la humedad y poco más. */
function tecnicasRefino(v: {
  humedad: string;
  color: string;
  cenizas: string;
  insoluble: string;
  sulfitos: string;
  insolubleNombre?: string;
}): Tabla {
  return {
    titulo: "Especificaciones técnicas",
    frecuencia: "Mínimo una vez por día de producción",
    filas: [
      { descripcion: "Polarización", unidad: "°Z", minimo: "99,7" },
      { descripcion: "Humedad", unidad: "%", maximo: v.humedad },
      { descripcion: "Color", unidad: "UI 7,0", maximo: v.color },
      { descripcion: "Cenizas (conductividad)", unidad: "%", maximo: v.cenizas },
      { descripcion: v.insolubleNombre ?? "Materia insoluble", unidad: "mg/kg", maximo: v.insoluble },
      { descripcion: "Sulfitos", unidad: "mg/kg", maximo: v.sulfitos },
      { descripcion: "Granulometría", unidad: "—", texto: "Estándar" },
    ],
  };
}

const destacadosRefino = (color: string, humedad: string) => [
  { valor: "99,7", unidad: "°Z", texto: "Polarización mínima" },
  { valor: color, unidad: "UI", texto: "Color máximo" },
  { valor: humedad, unidad: "%", texto: "Humedad máxima" },
  { valor: "50 kg", texto: "Sacos o big bags de 1.000 kg" },
];

export const PRODUCTOS: Producto[] = [
  {
    slug: "azucar-crudo",
    categoria: "Azúcares",
    nombre: "Azúcar Crudo",
    codigo: "LB-1001",
    foto: fotos.azucarCrudo,
    descripcion:
      "Cristales que conservan la película de miel de la caña, con aroma y sabor a melaza. Se despacha a granel.",
    etiquetas: ["Polarización 97,5 °Z", "A granel"],
    certificaciones: ["ISO 9001", "FSSC 22000"],
    ficha: {
      organolepticas: [
        { nombre: "Apariencia", valor: "Sólido cristalino" },
        { nombre: "Olor", valor: "Aroma característico de azúcar y melaza" },
        { nombre: "Sabor", valor: "Dulce característico con sabor a melaza" },
        { nombre: "Textura", valor: "Sólida granular" },
      ],
      destacados: [
        { valor: "97,5", unidad: "°Z", texto: "Polarización mínima" },
        { valor: "5.000", unidad: "UI", texto: "Color máximo" },
        { valor: "0,75", unidad: "%", texto: "Humedad máxima" },
        { valor: "A granel", texto: "Despacho desde el silo de azúcar" },
      ],
      tablas: [
        {
          titulo: "Especificaciones técnicas",
          filas: [
            { descripcion: "Polarización", unidad: "°Z", minimo: "97,5" },
            { descripcion: "Color", unidad: "UI 8,5", maximo: "5.000" },
            { descripcion: "Humedad", unidad: "%", maximo: "0,75" },
            { descripcion: "Factor de seguridad", unidad: "—", maximo: "0,30" },
            { descripcion: "Sulfitos", unidad: "—", texto: "No contiene" },
            { descripcion: "Cenizas", unidad: "%", maximo: "0,25" },
            { descripcion: "Granulometría", unidad: "% retenido malla N.º 28", minimo: "22", maximo: "45" },
            { descripcion: "Dextranas", unidad: "MAU", maximo: "250" },
          ],
        },
      ],
      notas: [{ titulo: "Alérgenos", texto: "No contiene." }],
      presentacion: ["Se despacha a granel en transportes adecuados para tal fin."],
    },
  },
  {
    slug: "azucar-blanco",
    categoria: "Azúcares",
    nombre: "Azúcar Blanco",
    codigo: "LB-1002",
    otrosNombres: "Azúcar blanco plantación · Azúcar blanco directo",
    foto: fotos.azucarBlanco,
    descripcion:
      "Azúcar blanco de plantación, producido directamente en el ingenio a partir del jugo de caña sulfitado y clarificado.",
    etiquetas: ["Polarización 99,5 °Z", "Color máx. 300 UI"],
    certificaciones: ["ISO 9001", "FSSC 22000", "Kosher"],
    ficha: {
      organolepticas: ORGANOLEPTICAS_BLANCO,
      destacados: [
        { valor: "99,5", unidad: "°Z", texto: "Polarización mínima" },
        { valor: "300", unidad: "UI", texto: "Color máximo" },
        { valor: "0,10", unidad: "%", texto: "Humedad máxima" },
        { valor: "50 kg", texto: "Sacos de polipropileno" },
      ],
      tablas: [
        {
          titulo: "Especificaciones técnicas",
          frecuencia: "Mínimo una vez por día de producción",
          filas: [
            { descripcion: "Polarización", unidad: "°Z", minimo: "99,50" },
            { descripcion: "Humedad", unidad: "%", maximo: "0,10" },
            { descripcion: "Color", unidad: "UI 7,0", maximo: "300" },
            { descripcion: "Cenizas (conductividad)", unidad: "%", maximo: "0,13" },
            { descripcion: "Materia insoluble", unidad: "mg/kg", maximo: "150" },
            { descripcion: "Sulfitos", unidad: "mg/kg", maximo: "50" },
          ],
        },
        MICROBIOLOGICAS,
        METALES,
      ],
      notas: NOTAS_AZUCAR,
      presentacion: [SACOS, EMPAQUE_LIMPIO],
    },
  },
  {
    slug: "azucar-blanco-e150",
    categoria: "Azúcares",
    nombre: "Azúcar Blanco E-150",
    codigo: "LB-1006",
    otrosNombres: "Azúcar blanco especial",
    foto: fotos.azucarE150,
    descripcion:
      "Azúcar blanco especial de bajo color, con control de turbidez, floc alcohólico, puntos negros y partículas magnetizables.",
    etiquetas: ["Color máx. 150 UI", "Baja turbidez"],
    certificaciones: ["ISO 9001", "FSSC 22000", "Kosher"],
    ficha: {
      organolepticas: ORGANOLEPTICAS_BLANCO,
      destacados: [
        { valor: "99,6", unidad: "°Z", texto: "Polarización mínima" },
        { valor: "150", unidad: "UI", texto: "Color máximo" },
        { valor: "0,04", unidad: "%", texto: "Humedad máxima" },
        { valor: "50 kg", texto: "Sacos o big bags de 1.000 kg" },
      ],
      tablas: [
        {
          titulo: "Especificaciones técnicas",
          frecuencia: "Mínimo una vez por día de producción",
          filas: [
            { descripcion: "Polarización", unidad: "°Z", minimo: "99,6" },
            { descripcion: "Humedad", unidad: "%", maximo: "0,04" },
            { descripcion: "Color", unidad: "UI 7,0", maximo: "150" },
            { descripcion: "Puntos negros", unidad: "/100 g", maximo: "7" },
            { descripcion: "Partículas magnetizables", unidad: "mg/kg", maximo: "1" },
            { descripcion: "Cenizas (conductividad)", unidad: "%", maximo: "0,05" },
            { descripcion: "Materia insoluble", unidad: "mg/kg", maximo: "50" },
            { descripcion: "Sulfitos", unidad: "mg/kg", maximo: "10" },
            { descripcion: "Granulometría", unidad: "% retención malla 20", minimo: "7,0" },
            { descripcion: "Turbidez", unidad: "NTU", maximo: "20" },
            {
              descripcion: "Potencial de floc (floc alcohólico)",
              unidad: "Absorbancia a 420 nm",
              maximo: "0,120",
            },
          ],
        },
        MICROBIOLOGICAS,
        METALES,
      ],
      notas: NOTAS_AZUCAR,
      presentacion: [SACOS, BIG_BAGS, EMPAQUE_LIMPIO],
    },
  },
  {
    slug: "azucar-refinado-nacional",
    categoria: "Azúcares",
    nombre: "Azúcar Refinado Nacional",
    codigo: "LB-1004",
    otrosNombres: "Azúcar refino de consumo nacional",
    foto: fotos.refinadoNacional,
    descripcion:
      "Azúcar refino para el consumo nacional, de 99,7 °Z de polarización y color máximo de 70 UI.",
    etiquetas: ["Color máx. 70 UI", "Consumo nacional"],
    certificaciones: ["ISO 9001", "Kosher"],
    ficha: {
      organolepticas: ORGANOLEPTICAS_BLANCO,
      destacados: destacadosRefino("70", "0,10"),
      tablas: [
        tecnicasRefino({ humedad: "0,10", color: "70", cenizas: "0,05", insoluble: "25", sulfitos: "15" }),
        MICROBIOLOGICAS,
        METALES,
      ],
      notas: NOTAS_AZUCAR,
      presentacion: [SACOS, BIG_BAGS, EMPAQUE_LIMPIO],
    },
  },
  {
    slug: "azucar-refinado-exportacion",
    categoria: "Azúcares",
    nombre: "Azúcar Refinado Exportación",
    codigo: "LB-1005",
    foto: fotos.refinadoExportacion,
    descripcion: "Azúcar refino con calidad de exportación: 99,7 °Z de polarización y color máximo de 45 UI.",
    etiquetas: ["Color máx. 45 UI", "Exportación"],
    certificaciones: ["ISO 9001", "Kosher"],
    ficha: {
      organolepticas: ORGANOLEPTICAS_BLANCO,
      destacados: destacadosRefino("45", "0,04"),
      tablas: [
        tecnicasRefino({
          humedad: "0,04",
          color: "45",
          cenizas: "0,015",
          insoluble: "20",
          sulfitos: "5",
          insolubleNombre: "Materia insoluble (gooch)",
        }),
        MICROBIOLOGICAS,
        METALES,
      ],
      notas: NOTAS_AZUCAR,
      presentacion: [SACOS, BIG_BAGS, EMPAQUE_LIMPIO],
    },
  },
  {
    slug: "azucar-refino-35-ui",
    categoria: "Azúcares",
    nombre: "Azúcar Refino 35 UI",
    codigo: "LB-1007",
    foto: fotos.refino35,
    descripcion: "Nuestro azúcar refino de menor color: máximo 35 UI, con 99,7 °Z de polarización.",
    etiquetas: ["Color máx. 35 UI", "Menor color"],
    certificaciones: ["ISO 9001", "Kosher"],
    ficha: {
      organolepticas: ORGANOLEPTICAS_BLANCO,
      destacados: destacadosRefino("35", "0,10"),
      tablas: [
        tecnicasRefino({ humedad: "0,10", color: "35", cenizas: "0,050", insoluble: "25", sulfitos: "15" }),
        MICROBIOLOGICAS,
        METALES,
      ],
      notas: NOTAS_AZUCAR,
      presentacion: [SACOS, BIG_BAGS, EMPAQUE_LIMPIO],
    },
  },
  {
    slug: "alcohol-etilico-neutro",
    categoria: "Alcoholes",
    nombre: "Alcohol Etílico Neutro",
    codigo: "LB-2401",
    otrosNombres: "Alcohol · Etanol · Etil alcohol · REN",
    foto: fotos.alcoholNeutro,
    descripcion:
      "Alcohol de nuestra destilería con fortaleza mínima de 96,1 °GL, apto para bebidas. Se despacha a granel en cisternas.",
    etiquetas: ["96,1 °GL", "A granel"],
    certificaciones: ["ISO 9001"],
    ficha: {
      organolepticas: [
        { nombre: "Color", valor: "Incoloro a levemente coloreado" },
        { nombre: "Olor", valor: "Característico del alcohol etílico" },
        { nombre: "Sabor", valor: "Alcohólico astringente" },
      ],
      destacados: [
        { valor: "96,1", unidad: "°GL", texto: "Fortaleza alcohólica mínima" },
        { valor: "Incoloro", texto: "A levemente coloreado" },
        { valor: "A granel", texto: "Despacho en cisternas" },
        { valor: "33,4", unidad: "M L", texto: "Capacidad de almacenamiento" },
      ],
      tablas: [
        {
          titulo: "Especificaciones técnicas",
          filas: [
            {
              descripcion: "Fortaleza alcohólica",
              unidad: "°GL",
              minimo: "96,1",
              metodo: "AOAC Tabla 913.02",
            },
            {
              descripcion: "Acidez como ácido acético",
              unidad: "mg/100 mL",
              maximo: "2,0",
              metodo: "ASTM D 1613",
            },
            {
              descripcion: "Aldehídos como acetaldehído",
              unidad: "mg/100 mL",
              maximo: "1,5",
              metodo: "ASTM E411",
            },
            { descripcion: "Metanol", unidad: "mg/100 mL", maximo: "5,0", metodo: "GLC" },
            { descripcion: "Ésteres", unidad: "mg/100 mL", maximo: "1,5", metodo: "GLC" },
            { descripcion: "Fusel", unidad: "mg/100 mL", maximo: "15,0", metodo: "GLC" },
            { descripcion: "Furfural", unidad: "—", texto: "Negativo" },
            { descripcion: "Tiempo de permanganato", unidad: "Minutos", minimo: "10,0" },
            {
              descripcion: "Residuo seco",
              unidad: "g/hL",
              minimo: "0,20",
              maximo: "1,00",
              metodo: "EEC 1238-92 método 10",
            },
          ],
        },
      ],
      presentacion: ["Se despacha a granel en cisternas, en transportes adecuados para tal fin."],
      granel: GRANEL_ALCOHOL,
    },
  },
  {
    slug: "alcohol-etilico-anhidro",
    categoria: "Alcoholes",
    nombre: "Alcohol Etílico Anhidro",
    codigo: "LB-2402",
    otrosNombres: "Alcohol · Etanol · Etil alcohol · REN",
    foto: fotos.alcoholAnhidro,
    descripcion:
      "Alcohol deshidratado en nuestra destilería con etilenglicol: contenido alcohólico mínimo de 99,84 % v/v y humedad máxima de 0,18 %.",
    etiquetas: ["99,84 % v/v", "A granel"],
    certificaciones: ["ISO 9001"],
    ficha: {
      organolepticas: [
        { nombre: "Color", valor: "Incoloro a levemente coloreado" },
        { nombre: "Olor", valor: "Característico del alcohol etílico" },
      ],
      destacados: [
        { valor: "99,84", unidad: "% v/v", texto: "Contenido alcohólico mínimo" },
        { valor: "0,18", unidad: "%", texto: "Humedad máxima" },
        { valor: "A granel", texto: "Despacho en cisternas" },
        { valor: "33,4", unidad: "M L", texto: "Capacidad de almacenamiento" },
      ],
      tablas: [
        {
          titulo: "Especificaciones técnicas",
          filas: [
            {
              descripcion: "Contenido alcohólico",
              unidad: "% v/v",
              minimo: "99,84",
              metodo: "AOAC Tabla 913.02",
            },
            {
              descripcion: "Contenido de etanol (pureza)",
              unidad: "% v/v",
              minimo: "99,5",
              metodo: "ASTM D 5501",
            },
            { descripcion: "Densidad", unidad: "kg/m³", maximo: "790,0", metodo: "ASTM D 1298" },
            { descripcion: "Contenido de humedad", unidad: "% v/v", maximo: "0,18", metodo: "ASTM 1364" },
            {
              descripcion: "Residuo no volátil",
              unidad: "mg/100 mL",
              maximo: "1,0",
              metodo: "EEC 1238-92 método 10",
            },
            { descripcion: "Nitrógeno", unidad: "mg/100 mL", maximo: "0,20", metodo: "ASTM D4629" },
            { descripcion: "Cloro", unidad: "mg/100 mL", maximo: "0,10", metodo: "ASTM D5808" },
            { descripcion: "Azufre", unidad: "mg/100 mL", maximo: "0,10", metodo: "ISO 20846" },
            { descripcion: "Fósforo", unidad: "mg/100 mL", maximo: "0,05", metodo: "EN 15487" },
            { descripcion: "Metanol", unidad: "mg/100 mL", maximo: "7,0", metodo: "GLC" },
            { descripcion: "Hierro", unidad: "mg/100 mL", maximo: "0,10", metodo: "ASTM E394" },
            {
              descripcion: "Ésteres como acetato de etilo",
              unidad: "mg/100 mL",
              maximo: "7,0",
              metodo: "GLC",
            },
            { descripcion: "Cobre", unidad: "mg/100 mL", maximo: "0,01", metodo: "ASTM E394" },
            {
              descripcion: "Aldehídos como acetaldehído",
              unidad: "mg/100 mL",
              maximo: "15,0",
              metodo: "ASTM E411",
            },
            { descripcion: "Alcoholes de alto peso", unidad: "mg/100 mL", maximo: "75,0", metodo: "GLC" },
            { descripcion: "Acetona", unidad: "mg/100 mL", maximo: "0,80", metodo: "GLC" },
            {
              descripcion: "Acidez como ácido acético",
              unidad: "mg/100 mL",
              maximo: "3,0",
              metodo: "ASTM 1613",
            },
            {
              descripcion: "Número de neutralización (KOH)",
              unidad: "mg/mL KOH",
              maximo: "0,03",
              metodo: "ASTM D1613",
            },
          ],
        },
      ],
      presentacion: ["Se despacha a granel en cisternas, en transportes adecuados para tal fin."],
      granel: GRANEL_ALCOHOL,
    },
  },
  {
    slug: "miel",
    categoria: "Miel",
    nombre: "Miel",
    codigo: "LB-0803",
    otrosNombres: "Miel de purga · Miel final · Miel C · Melaza",
    foto: fotos.miel,
    descripcion:
      "La miel final que queda al agotar las mieles en la fabricación del azúcar. Se usa en la alimentación de ganado y como materia prima para producir alcohol.",
    etiquetas: ["Mín. 79,5 °Brix", "A granel"],
    certificaciones: [],
    ficha: {
      organolepticas: [
        { nombre: "Color", valor: "Café oscuro" },
        { nombre: "Olor", valor: "A tapa de dulce" },
        { nombre: "Sabor", valor: "Dulce amargo" },
        { nombre: "Apariencia", valor: "Líquido muy viscoso" },
      ],
      destacados: [
        { valor: "79,5", unidad: "°Brix", texto: "Sólidos solubles mínimos" },
        { valor: "54,0", unidad: "%", texto: "Azúcares reductores totales mínimos" },
        { valor: "Café", texto: "Oscuro, muy viscoso" },
        { valor: "A granel", texto: "Despacho en cisternas" },
      ],
      tablas: [
        {
          titulo: "Especificaciones técnicas",
          filas: [
            { descripcion: "Grados Brix", unidad: "°Brix", minimo: "79,5" },
            { descripcion: "Azúcares reductores totales", unidad: "%", minimo: "54,0" },
          ],
        },
      ],
      presentacion: ["Se despacha a granel en cisternas, en transportes adecuados para tal fin."],
    },
  },
  {
    slug: "arroz",
    categoria: "Arroz",
    nombre: "Arroz",
    foto: fotos.arroz,
    descripcion:
      "Desde hace más de diez años rotamos arroz anegado y caña de azúcar en al menos 500 hectáreas por año. La caña gana hasta un 30 % de rendimiento en su primera cosecha y ambos cultivos necesitan menos agroquímicos.",
    etiquetas: ["Rotación arroz – caña", "500 ha por año"],
    certificaciones: [],
  },
];

/** "Azúcares" → "azucares": lo que viaja en el ancla (/productos#azucares). */
export const anclaDe = (texto: string) => texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export const productoPorSlug = (slug: string) => PRODUCTOS.find((p) => p.slug === slug);
