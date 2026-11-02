import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { EstadoVacio } from "@/components/shared/estado-vacio";
import { Protegido } from "@/features/auth/components/protegido";

export const metadata: Metadata = { title: "Biblioteca de medios" };

export default function MediosPanelPage() {
  return (
    <Protegido modulo="medios">
      <EncabezadoPagina titulo="Biblioteca de medios" descripcion="Imágenes y documentos del sitio." />
      <EstadoVacio titulo="Módulo en construcción" />
    </Protegido>
  );
}
