"use server";

import { refresh } from "next/cache";
import { apiPanel, intentar } from "@/features/auth/server/panel";
import type { EspacioPanel } from "./types";

/** Django valida contra la definición del espacio y avisa al sitio para que lo muestre. */
export async function guardarEspacio(clave: string, datos: Record<string, unknown>) {
  const resultado = await intentar(() =>
    apiPanel<EspacioPanel>(`/api/panel/contenido/espacios/${encodeURIComponent(clave)}/`, {
      method: "PUT",
      body: { datos },
    }),
  );
  if (resultado.ok) refresh();
  return resultado;
}
