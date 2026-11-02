import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { env } from "@/lib/env";

// Webhook que llama Django al publicar, editar o despublicar algo.
// Cuerpo: { "etiquetas": ["noticias", "noticia:mi-slug"] } (ver lib/api/etiquetas.ts).
const cuerpo = z.object({ etiquetas: z.array(z.string().min(1).max(200)).min(1).max(50) });

export async function POST(request: Request) {
  if (!env.REVALIDATE_SECRET) {
    return Response.json({ error: "Revalidación no configurada" }, { status: 503 });
  }
  if (!secretoValido(request.headers.get("x-revalidate-secret"), env.REVALIDATE_SECRET)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const datos = cuerpo.safeParse(await request.json().catch(() => null));
  if (!datos.success) {
    return Response.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  for (const etiqueta of datos.data.etiquetas) revalidateTag(etiqueta, "max");
  return Response.json({ revalidadas: datos.data.etiquetas });
}

function secretoValido(recibido: string | null, esperado: string) {
  if (!recibido) return false;
  const a = Buffer.from(recibido);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}
