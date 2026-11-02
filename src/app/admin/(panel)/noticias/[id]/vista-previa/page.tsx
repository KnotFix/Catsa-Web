import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { exigirModulo } from "@/features/auth/server/dal";
import { ArticuloNoticia } from "@/features/noticias/components/articulo-noticia";
import { vistaPreviaNoticia } from "@/features/noticias/server/panel";
import { ApiError } from "@/lib/api/errores";

export const metadata: Metadata = { title: "Vista previa" };

export default function VistaPreviaNoticiaPage({ params }: PageProps<"/admin/noticias/[id]/vista-previa">) {
  return (
    <Suspense fallback={<CargandoPagina />}>
      <VistaPrevia params={params} />
    </Suspense>
  );
}

async function VistaPrevia({ params }: Pick<PageProps<"/admin/noticias/[id]/vista-previa">, "params">) {
  await exigirModulo("noticias");
  const id = Number((await params).id);
  const noticia = await vistaPreviaNoticia(id).catch((error) => {
    if (error instanceof ApiError && error.noEncontrado) notFound();
    throw error;
  });

  return (
    <>
      <p
        role="status"
        className="mx-auto mb-8 max-w-3xl rounded-lg bg-catsa-amber-bg px-4 py-3 text-sm text-catsa-amber-ink"
      >
        Vista previa: así se verá en el sitio con lo último que se guardó.
      </p>
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm tablet:p-12">
        <ArticuloNoticia noticia={noticia} />
      </div>
    </>
  );
}
