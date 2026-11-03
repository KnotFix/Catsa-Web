import type { Route } from "next";
import { fotos } from "./imagenes";

/**
 * Catálogo de productos. Contenido fijo por alcance (la bitácora deja el
 * catálogo fuera del panel: los cambios se atienden por mantenimiento).
 */

export type Producto = {
  /** Ancla en /productos#… y orden del explorador. */
  slug: string;
  categoria: "Azúcares" | "Alcoholes" | "Miel";
  nombre: string;
  codigo: string;
  foto: { src: string; alt: string };
  descripcion: string;
  etiquetas: string[];
  usos: string;
  otrosNombres?: string;
  /** Solo los que tienen ficha técnica completa publicada. */
  ficha?: Ficha;
};

export type Ficha = {
  href: Route;
  organolepticas: { nombre: "Color" | "Olor" | "Sabor"; valor: string }[];
  especificaciones: { descripcion: string; unidad: string; minimo: string; maximo: string; metodo: string }[];
  cisterna: string;
  tanques: { millones: string; nombre: string }[];
  almacenamientoTotal: string;
};

export const CERTIFICACIONES = "ISO 9001 · FSSC 22000 · Kosher · ISCC · Esencial Costa Rica";

const alcoholNeutro: Ficha = {
  href: "/productos/alcohol-etilico-neutro",
  organolepticas: [
    { nombre: "Color", valor: "Incoloro a levemente coloreado" },
    { nombre: "Olor", valor: "Característico del alcohol etílico" },
    { nombre: "Sabor", valor: "Alcohólico astringente" },
  ],
  especificaciones: [
    {
      descripcion: "Fortaleza alcohólica",
      unidad: "°GL",
      minimo: "96.1",
      maximo: "—",
      metodo: "AOAC Tabla 913.02",
    },
    {
      descripcion: "Acidez como ácido acético",
      unidad: "mg/100 mL",
      minimo: "—",
      maximo: "2.0",
      metodo: "ASTM D 1613",
    },
    {
      descripcion: "Aldehídos como acetaldehído",
      unidad: "mg/100 mL",
      minimo: "—",
      maximo: "1.5",
      metodo: "ASTM E411",
    },
    { descripcion: "Metanol", unidad: "mg/100 mL", minimo: "—", maximo: "5.0", metodo: "GLC" },
    { descripcion: "Ésteres", unidad: "mg/100 mL", minimo: "—", maximo: "1.5", metodo: "GLC" },
    { descripcion: "Fusel", unidad: "mg/100 mL", minimo: "—", maximo: "15.0", metodo: "GLC" },
    { descripcion: "Furfural", unidad: "N/A", minimo: "Negativo", maximo: "", metodo: "—" },
    { descripcion: "Tiempo permanganato", unidad: "Minutos", minimo: "10.0", maximo: "—", metodo: "—" },
    {
      descripcion: "Residuo seco",
      unidad: "g/hL",
      minimo: "0,20",
      maximo: "1,00",
      metodo: "EEC 1238-92 método 10",
    },
  ],
  cisterna: "30.000 – 35.000 L",
  tanques: [
    { millones: "9.7", nombre: "Tanque de almacenamiento CATSA" },
    { millones: "6.7", nombre: "Tanque N.º 105 · P. Morales" },
    { millones: "8.7", nombre: "Tanque N.º 107 · P. Morales" },
    { millones: "8.3", nombre: "Tanque N.º 109 · P. Morales" },
  ],
  almacenamientoTotal: "33.4",
};

export const PRODUCTOS: Producto[] = [
  {
    slug: "azucar-crudo",
    categoria: "Azúcares",
    nombre: "Azúcar Crudo",
    codigo: "SA-CR",
    foto: fotos.azucar,
    descripcion:
      "Cristales dorados que conservan una película natural de miel de caña. La esencia de la caña guanacasteca, con el mínimo procesamiento.",
    etiquetas: ["Exportación", "Grado alimentario"],
    usos: "Industria alimentaria y consumo.",
  },
  {
    slug: "azucar-blanco",
    categoria: "Azúcares",
    nombre: "Azúcar Blanco",
    codigo: "SA-BL",
    foto: fotos.azucar,
    descripcion: "Azúcar de plantación para consumo directo en hogares e industria.",
    etiquetas: ["Consumo directo"],
    usos: "Hogar e industria.",
  },
  {
    slug: "azucar-blanco-e150",
    categoria: "Azúcares",
    nombre: "Azúcar Blanco E-150",
    codigo: "SA-E150",
    foto: fotos.azucar,
    descripcion: "Azúcar especial de bajo color, ideal para la industria de alimentos.",
    etiquetas: ["Bajo color", "Industria"],
    usos: "Industria de alimentos.",
  },
  {
    slug: "azucar-refinado-nacional",
    categoria: "Azúcares",
    nombre: "Azúcar Refinado Nacional",
    codigo: "SA-RN",
    foto: fotos.azucar,
    descripcion:
      "Azúcar refinado de alta pureza para la industria alimentaria, de bebidas y farmacéutica de Costa Rica.",
    etiquetas: ["Alta pureza"],
    usos: "Alimentos, bebidas y farmacéutica.",
  },
  {
    slug: "azucar-refinado-exportacion",
    categoria: "Azúcares",
    nombre: "Azúcar Refinado Exportación",
    codigo: "SA-RE",
    foto: fotos.azucar,
    descripcion:
      "Azúcar refinado con calidad de exportación, producido bajo certificaciones internacionales.",
    etiquetas: ["Exportación", "Kosher"],
    usos: "Clientes internacionales.",
  },
  {
    slug: "azucar-refino-35ui",
    categoria: "Azúcares",
    nombre: "Azúcar Refino 35 UI",
    codigo: "SA-35UI",
    foto: fotos.azucar,
    descripcion:
      "Nuestro refinado de mayor pureza y menor color, destinado a los procesos industriales más exigentes.",
    etiquetas: ["Máxima pureza"],
    usos: "Industria de alta exigencia.",
  },
  {
    slug: "alcohol-etilico-neutro",
    categoria: "Alcoholes",
    nombre: "Alcohol Etílico Neutro",
    codigo: "LB-2401",
    foto: fotos.alcohol,
    otrosNombres: "Alcohol · Etanol · Etil alcohol · REN",
    descripcion:
      "Alcohol de alta calidad producido en nuestra destilería, con fortaleza mínima de 96.1° GL. Se despacha a granel en cisternas.",
    etiquetas: ["96.1° GL", "A granel", "Etanol · REN"],
    usos: "Múltiples aplicaciones industriales.",
    ficha: alcoholNeutro,
  },
  {
    slug: "miel-de-cana",
    categoria: "Miel",
    nombre: "Miel de Caña",
    codigo: "MI-01",
    foto: fotos.miel,
    descripcion:
      "Producto natural derivado del proceso de molienda y refinación de la caña, con múltiples usos en la industria de alimentos y la producción animal.",
    etiquetas: ["Natural", "Uso industrial"],
    usos: "Alimentos y producción animal.",
  },
];

/** "Azúcares" → "azucares": lo que viaja en el ancla (/productos#azucares). */
export const anclaDe = (texto: string) => texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
