"use server";

import { refresh } from "next/cache";
import { apiPanel, intentar } from "@/features/auth/server/panel";
import type { AjustesPanel, EspacioPanel, GuardarAjustes } from "./types";

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

/** Contacto, horario, redes e imagen para compartir. Cambian en todo el sitio a la vez. */
export async function guardarAjustes(datos: GuardarAjustes) {
  const resultado = await intentar(() =>
    apiPanel<AjustesPanel>("/api/panel/contenido/ajustes/", { method: "PUT", body: datos }),
  );
  if (resultado.ok) refresh();
  return resultado;
}
