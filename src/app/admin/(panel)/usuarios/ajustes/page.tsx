import { Suspense } from "react";
import type { Metadata } from "next";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { exigirModulo } from "@/features/auth/server/dal";
import { FormularioAjustes } from "@/features/contenido/components/formulario-ajustes";
import { obtenerAjustesPanel } from "@/features/contenido/server/panel";
import { obtenerMedio } from "@/features/medios/server/api";
import { PestanasAdministracion } from "@/features/usuarios/components/pestanas-administracion";
import { formatearFecha } from "@/lib/formato";

export const metadata: Metadata = { title: "Ajustes del sitio" };

export default function AjustesPage() {
  return (
    <>
      <EncabezadoPagina
        titulo="Administración"
        descripcion="Datos de contacto, horario, redes e imagen para compartir. Se editan aquí y cambian en todo el sitio a la vez."
      />
      <PestanasAdministracion activa="ajustes" />
      <Suspense fallback={<CargandoPagina />}>
        <Editor />
      </Suspense>
    </>
  );
}

async function Editor() {
  const usuario = await exigirModulo("administracion");
  const ajustes = await obtenerAjustesPanel();
  // Se guarda como id: se trae el medio para mostrarlo en el selector.
  const imagen = ajustes.imagen_compartir
    ? await obtenerMedio(ajustes.imagen_compartir).catch(() => null)
    : null;

  return (
    <>
      {ajustes.actualizado_por && ajustes.actualizado_en && (
        <p className="mb-6 text-sm text-catsa-muted">
          Última edición: {ajustes.actualizado_por}, {formatearFecha(ajustes.actualizado_en)}
        </p>
      )}
      <FormularioAjustes ajustes={ajustes} imagen={imagen} puedeSubir={usuario.modulos.includes("medios")} />
    </>
  );
}
