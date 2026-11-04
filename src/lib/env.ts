import "server-only";
import { z } from "zod";

// Variables de entorno del servidor, validadas una sola vez al arrancar.
// Nada de aquí llega al navegador: no usar el prefijo NEXT_PUBLIC_.
const esquema = z.object({
  /** Origen de Catsa-Api, sin barra final. En producción es la red interna de Docker. */
  API_URL: z.url().default("http://localhost:8000"),
  /** URL pública del sitio, para metadatos, sitemap y enlaces absolutos. */
  SITE_URL: z.url().default("http://localhost:3000"),
  /** Secreto compartido con Django para el webhook de revalidación. */
  REVALIDATE_SECRET: z.string().min(32).optional(),
  /** Solo producción lo pone en true. En cualquier otro ambiente el sitio pide no ser indexado. */
  INDEXAR: z.stringbool().default(false),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = esquema.parse(process.env);
