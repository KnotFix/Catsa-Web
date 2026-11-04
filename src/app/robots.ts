import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  // Dev y cualquier ambiente de pruebas: fuera de los buscadores.
  if (!env.INDEXAR) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${env.SITE_URL}/sitemap.xml`,
  };
}
