import { Suspense, type ReactNode } from "react";
import type { Modulo } from "@/config/modulos";
import { Skeleton } from "@/components/ui/skeleton";
import { exigirModulo } from "../server/dal";

/**
 * Envuelve el contenido de una página del panel. Valida la sesión y el permiso
 * del módulo antes de mostrar nada. Va dentro de Suspense porque lee cookies:
 * así el resto de la página (layout, barra lateral) no espera a Django.
 */
export function Protegido({ modulo, children }: { modulo: Modulo; children: ReactNode }) {
  return (
    <Suspense fallback={<CargandoPagina />}>
      <Verificar modulo={modulo}>{children}</Verificar>
    </Suspense>
  );
}

async function Verificar({ modulo, children }: { modulo: Modulo; children: ReactNode }) {
  await exigirModulo(modulo);
  return children;
}

export function CargandoPagina() {
  return (
    <div className="grid gap-4" aria-busy="true" aria-label="Cargando">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
