import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { GestorEtiquetas } from "@/components/shared/gestor-etiquetas";
import { Button } from "@/components/ui/button";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { exigirModulo } from "@/features/auth/server/dal";
import { eliminarArea, guardarArea } from "@/features/puestos/actions";
import { listarAreasPanel } from "@/features/puestos/server/panel";

export const metadata: Metadata = { title: "Áreas de puestos" };

export default function AreasPage() {
  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/puestos">
          <ArrowLeft aria-hidden />
          Puestos
        </Link>
      </Button>
      <EncabezadoPagina
        titulo="Áreas"
        descripcion="Agrupan los puestos y sirven de filtro en el sitio. Un área con puestos no se puede eliminar."
      />
      <Suspense fallback={<CargandoPagina />}>
        <Lista />
      </Suspense>
    </>
  );
}

async function Lista() {
  await exigirModulo("puestos");
  const areas = await listarAreasPanel();
  return (
    <GestorEtiquetas items={areas} nombreSingular="Área" guardar={guardarArea} eliminar={eliminarArea} />
  );
}
