import { Suspense } from "react";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { Skeleton } from "@/components/ui/skeleton";
import { obtenerUsuario } from "@/features/auth/server/dal";

export default function PanelInicioPage() {
  return (
    <Suspense fallback={<Skeleton className="h-16 w-80" />}>
      <Bienvenida />
    </Suspense>
  );
}

async function Bienvenida() {
  const usuario = await obtenerUsuario();
  return (
    <EncabezadoPagina
      titulo={`Hola, ${usuario.nombre}`}
      descripcion="Elija un módulo en la barra lateral para empezar."
    />
  );
}
