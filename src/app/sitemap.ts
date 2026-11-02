import type { MetadataRoute } from "next";
import { listarNoticias } from "@/features/noticias/api";
import { listarPuestos } from "@/features/puestos/api";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [noticias, puestos] = await Promise.all([listarNoticias(), listarPuestos()]);
  const url = (ruta: string) => `${env.SITE_URL}${ruta}`;

  return [
    { url: url("/") },
    { url: url("/noticias") },
    { url: url("/puestos") },
    ...noticias.results.map((n) => ({ url: url(`/noticias/${n.slug}`), lastModified: n.publicada_en })),
    ...puestos.results.map((p) => ({ url: url(`/puestos/${p.slug}`) })),
  ];
}
