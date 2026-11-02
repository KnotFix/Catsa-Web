import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { z } from "zod";
import { etiquetas } from "@/lib/api/etiquetas";
import { apiFetch } from "@/lib/api/http";
import { conRespaldo } from "@/lib/api/respaldo";

type Espacio<T> = { clave: string; esquema: z.ZodType<T>; porDefecto: T };

/**
 * Espacios editables (bitácora D-012): textos e imágenes en lugares fijos del
 * diseño. Django guarda cada espacio validado contra su esquema; aquí se vuelve
 * a validar con zod y, si algo no calza o la API no responde, se usa el texto
 * por defecto del diseño. Así un espacio nunca rompe la página.
 */
export async function obtenerEspacio<T>({ clave, esquema, porDefecto }: Espacio<T>): Promise<T> {
  const validado = esquema.safeParse(await leerEspacio(clave));
  return validado.success ? validado.data : porDefecto;
}

// Solo la lectura cruda va en caché: la clave de caché tiene que ser serializable.
async function leerEspacio(clave: string): Promise<unknown> {
  "use cache";
  cacheTag(etiquetas.espacio(clave));
  cacheLife("days");
  return conRespaldo(
    () => apiFetch<{ datos: unknown }>(`/api/contenido/espacios/${clave}/`).then((r) => r.datos),
    null,
  );
}
