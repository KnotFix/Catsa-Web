import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { EstadoVacio } from "@/components/shared/estado-vacio";
import { Protegido } from "@/features/auth/components/protegido";

export const metadata: Metadata = { title: "Puestos" };

export default function PuestosPanelPage() {
  return (
    <Protegido modulo="puestos">
      <EncabezadoPagina titulo="Puestos" descripcion="Publique y cierre las vacantes de CATSA." />
      <EstadoVacio titulo="Módulo en construcción" />
    </Protegido>
  );
}
