import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { EstadoVacio } from "@/components/shared/estado-vacio";
import { Protegido } from "@/features/auth/components/protegido";

export const metadata: Metadata = { title: "Administración" };

export default function UsuariosPanelPage() {
  return (
    <Protegido modulo="administracion">
      <EncabezadoPagina
        titulo="Administración"
        descripcion="Usuarios, permisos por módulo y registro de accesos."
      />
      <EstadoVacio titulo="Módulo en construcción" />
    </Protegido>
  );
}
