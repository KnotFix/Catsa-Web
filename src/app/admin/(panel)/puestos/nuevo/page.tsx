import { Suspense } from "react";
import type { Metadata } from "next";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { exigirModulo } from "@/features/auth/server/dal";
import { FormularioPuesto } from "@/features/puestos/components/panel/formulario-puesto";
import { listarAreasPanel, ubicacionesUsadas } from "@/features/puestos/server/panel";

export const metadata: Metadata = { title: "Nuevo puesto" };

export default function NuevoPuestoPage() {
  return (
    <Suspense fallback={<CargandoPagina />}>
      <Formulario />
    </Suspense>
  );
}

async function Formulario() {
  const usuario = await exigirModulo("puestos");
  const [areas, ubicaciones] = await Promise.all([listarAreasPanel(), ubicacionesUsadas()]);
  return (
    <FormularioPuesto
      areas={areas}
      ubicaciones={ubicaciones}
      puedeSubir={usuario.modulos.includes("medios")}
    />
  );
}
