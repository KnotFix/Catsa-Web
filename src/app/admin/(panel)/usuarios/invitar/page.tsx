import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { Button } from "@/components/ui/button";
import { Protegido } from "@/features/auth/components/protegido";
import { FormularioUsuario } from "@/features/usuarios/components/formulario-usuario";

export const metadata: Metadata = { title: "Invitar" };

export default function InvitarPage() {
  return (
    <Protegido modulo="administracion">
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/usuarios">
          <ArrowLeft aria-hidden />
          Usuarios
        </Link>
      </Button>
      <EncabezadoPagina
        titulo="Invitar a una persona"
        descripcion="Le llega un correo con un enlace para crear su contraseña. Después configura la verificación en dos pasos y entra solo a los módulos que marque aquí."
      />
      <FormularioUsuario />
    </Protegido>
  );
}
