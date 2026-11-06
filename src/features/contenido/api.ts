import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { ApiError } from "@/lib/api/errores";
import { etiquetas } from "@/lib/api/etiquetas";
import { apiFetch } from "@/lib/api/http";
import { conRespaldo } from "@/lib/api/respaldo";
import type { Espacio } from "./espacios";

/**
 * Espacios editables (bitácora D-007): textos e imágenes en lugares fijos del
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
  return conRespaldo(async () => {
    try {
      const { datos } = await apiFetch<{ datos: unknown }>(`/api/contenido/espacios/${clave}/`);
      return datos;
    } catch (error) {
      // 404: nunca se editó desde el panel. Es lo normal al inicio, no un fallo.
      if (error instanceof ApiError && error.noEncontrado) return null;
      throw error;
    }
  }, null);
}
