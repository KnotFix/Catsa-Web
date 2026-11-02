import "server-only";
import { cacheLife } from "next/cache";
import { ApiError, esFalloDeRed } from "./errores";

/**
 * Para lecturas públicas dentro de "use cache". Si la API no responde o
 * responde con error (caída, endpoint o espacio que todavía no existe), la
 * página sale con el valor de respaldo en vez de romperse, y la entrada se
 * marca de vida corta para que Next la vuelva a pedir pronto en lugar de
 * guardar el respaldo por horas. Los errores de programación sí se propagan.
 */
export async function conRespaldo<T>(leer: () => Promise<T>, respaldo: T): Promise<T> {
  try {
    return await leer();
  } catch (error) {
    if (!(error instanceof ApiError) && !esFalloDeRed(error)) throw error;
    console.error("[catsa-api] lectura con respaldo:", describir(error));
    cacheLife("seconds");
    return respaldo;
  }
}

function describir(error: unknown) {
  if (error instanceof ApiError) return error.message;
  return error instanceof Error ? `${error.name}: ${error.message || "sin conexión"}` : String(error);
}
