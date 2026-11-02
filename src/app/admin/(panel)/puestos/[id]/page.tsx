import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { exigirModulo } from "@/features/auth/server/dal";
import { FormularioPuesto } from "@/features/puestos/components/panel/formulario-puesto";
import { listarAreasPanel, obtenerPuestoPanel, ubicacionesUsadas } from "@/features/puestos/server/panel";
import { ApiError } from "@/lib/api/errores";

export const metadata: Metadata = { title: "Editar puesto" };

export default function EditarPuestoPage({ params }: PageProps<"/admin/puestos/[id]">) {
  return (
    <Suspense fallback={<CargandoPagina />}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: Pick<PageProps<"/admin/puestos/[id]">, "params">) {
  const usuario = await exigirModulo("puestos");
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();

  const [puesto, areas, ubicaciones] = await Promise.all([
    obtenerPuestoPanel(id).catch((error) => {
      if (error instanceof ApiError && error.noEncontrado) notFound();
      throw error;
    }),
    listarAreasPanel(),
    ubicacionesUsadas(),
  ]);

  return (
    <FormularioPuesto
      puesto={puesto}
      areas={areas}
      ubicaciones={ubicaciones}
      puedeSubir={usuario.modulos.includes("medios")}
    />
  );
}
