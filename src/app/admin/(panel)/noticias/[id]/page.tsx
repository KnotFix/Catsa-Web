import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { exigirModulo } from "@/features/auth/server/dal";
import { obtenerMedio } from "@/features/medios/server/api";
import type { Medio } from "@/features/medios/types";
import { EditorNoticia } from "@/features/noticias/components/panel/editor-noticia";
import { listarCategoriasPanel, obtenerNoticiaPanel } from "@/features/noticias/server/panel";
import { ApiError } from "@/lib/api/errores";

export const metadata: Metadata = { title: "Editar noticia" };

export default function EditarNoticiaPage({ params }: PageProps<"/admin/noticias/[id]">) {
  return (
    <Suspense fallback={<CargandoPagina />}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: Pick<PageProps<"/admin/noticias/[id]">, "params">) {
  const usuario = await exigirModulo("noticias");
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const [noticia, categorias] = await Promise.all([
    obtenerNoticiaPanel(id).catch((error) => {
      if (error instanceof ApiError && error.noEncontrado) notFound();
      throw error;
    }),
    listarCategoriasPanel(),
  ]);

  // Las imágenes de los bloques vienen como id: se traen para mostrarlas en el editor.
  const ids = [...new Set(noticia.bloques.flatMap((b) => (b.tipo === "imagen" ? [b.medio] : [])))];
  const medios = await Promise.all(ids.map((m) => obtenerMedio(m).catch(() => null)));
  const imagenes = Object.fromEntries(
    medios.filter((m): m is NonNullable<typeof m> => m !== null).map((m) => [m.id, m as Medio]),
  );

  return (
    <EditorNoticia
      noticia={noticia}
      categorias={categorias}
      imagenes={imagenes}
      puedeSubir={usuario.modulos.includes("medios")}
    />
  );
}
