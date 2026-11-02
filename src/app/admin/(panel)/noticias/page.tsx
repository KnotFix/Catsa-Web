import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { EstadoVacio } from "@/components/shared/estado-vacio";
import { Protegido } from "@/features/auth/components/protegido";

export const metadata: Metadata = { title: "Noticias" };

export default function NoticiasPanelPage() {
  return (
    <Protegido modulo="noticias">
      <EncabezadoPagina titulo="Noticias" descripcion="Cree, edite y publique las noticias del sitio." />
      <EstadoVacio titulo="Módulo en construcción" />
    </Protegido>
  );
}
