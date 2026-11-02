import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { navegacionPanel } from "@/config/modulos";
import { exigirPanel } from "@/features/auth/server/dal";
import { EnlacePanel } from "./enlace-panel";
import { MenuUsuario } from "./menu-usuario";

// El marco de la barra se prerenderiza; los módulos dependen del usuario y
// llegan después, detrás de Suspense.
export function BarraLateral() {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-sidebar px-4 py-6 text-sidebar-foreground">
      <div className="px-3">
        <p className="font-heading text-lg font-bold">CATSA</p>
        <p className="text-xs text-sidebar-foreground/60">Panel administrativo</p>
      </div>
      <Suspense fallback={<CargandoModulos />}>
        <ModulosDelUsuario />
      </Suspense>
    </aside>
  );
}

async function ModulosDelUsuario() {
  const usuario = await exigirPanel();
  const visibles = navegacionPanel.filter((e) => !e.modulo || usuario.modulos.includes(e.modulo));

  return (
    <>
      <nav aria-label="Módulos" className="mt-8 flex-1">
        <ul className="space-y-1 text-sm">
          {visibles.map(({ titulo, href, icono: Icono }) => (
            <li key={href}>
              <EnlacePanel href={href}>
                <Icono className="size-4" aria-hidden />
                {titulo}
              </EnlacePanel>
            </li>
          ))}
        </ul>
      </nav>
      <MenuUsuario nombre={usuario.nombre} email={usuario.email} />
    </>
  );
}

function CargandoModulos() {
  return (
    <div className="mt-8 grid gap-2 px-3">
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="h-8 bg-sidebar-accent" />
      ))}
    </div>
  );
}
