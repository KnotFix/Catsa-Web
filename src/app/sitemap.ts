import type { MetadataRoute } from "next";
import { listarNoticias } from "@/features/noticias/api";
import { listarPuestos } from "@/features/puestos/api";
import { PRODUCTOS } from "@/features/sitio/productos";
import { env } from "@/lib/env";

// Páginas de contenido fijo del sitio, con una ficha por producto (las de datos se suman abajo).
const FIJAS = [
  "/",
  "/sobre-nosotros",
  "/areas",
  "/como-trabajamos",
  "/productos",
  ...PRODUCTOS.filter((p) => p.ficha).map((p) => `/productos/${p.slug}`),
  "/certificaciones",
  "/rse",
  "/contacto",
  "/noticias",
  "/puestos",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [noticias, puestos] = await Promise.all([listarNoticias(), listarPuestos()]);
  const url = (ruta: string) => `${env.SITE_URL}${ruta}`;

  return [
    ...FIJAS.map((ruta) => ({ url: url(ruta) })),
    ...noticias.results.map((n) => ({ url: url(`/noticias/${n.slug}`), lastModified: n.publicada_en })),
    ...puestos.results.map((p) => ({ url: url(`/puestos/${p.slug}`) })),
  ];
}
