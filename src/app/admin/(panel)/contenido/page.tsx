import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { EstadoVacio } from "@/components/shared/estado-vacio";
import { Protegido } from "@/features/auth/components/protegido";

export const metadata: Metadata = { title: "Contenido del sitio" };

export default function ContenidoPanelPage() {
  return (
    <Protegido modulo="contenido">
      <EncabezadoPagina
        titulo="Contenido del sitio"
        descripcion="Cambie textos e imágenes de las páginas sin tocar el diseño."
      />
      <EstadoVacio titulo="Módulo en construcción" />
    </Protegido>
  );
}
