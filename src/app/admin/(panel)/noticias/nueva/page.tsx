import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { Protegido } from "@/features/auth/components/protegido";
import { FormularioNuevaNoticia } from "@/features/noticias/components/panel/formulario-nueva";

export const metadata: Metadata = { title: "Nueva noticia" };

export default function NuevaNoticiaPage() {
  return (
    <Protegido modulo="noticias">
      <EncabezadoPagina
        titulo="Nueva noticia"
        descripcion="Empiece por el título. Se guarda como borrador y nadie la ve hasta que la publique."
      />
      <FormularioNuevaNoticia />
    </Protegido>
  );
}
