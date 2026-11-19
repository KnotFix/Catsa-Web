"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

/**
 * Debajo de 900 px la barra lateral no cabe: se reemplaza por una franja con
 * el botón de menú, que abre los mismos módulos en un panel desde la izquierda.
 * Se cierra sola al cambiar de página.
 */
export function MenuMovil({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="sticky top-0 z-40 flex items-center gap-3 bg-sidebar px-4 py-3 text-sidebar-foreground tablet:hidden">
      {/* La ruta es dato de la petición en las páginas con [id]: va aparte y
          detrás de Suspense para no frenar el prerender del marco. */}
      <Suspense>
        <AlNavegar setAbierto={setAbierto} />
      </Suspense>
      <Sheet open={abierto} onOpenChange={setAbierto}>
        <SheetTrigger
          aria-label="Abrir el menú del panel"
          className="flex size-11 items-center justify-center rounded-lg transition-colors ease-catsa hover:bg-sidebar-accent"
        >
          <Menu className="size-5" aria-hidden />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 border-sidebar-border bg-sidebar px-4 py-6 text-sidebar-foreground"
        >
          <SheetTitle className="sr-only">Menú del panel</SheetTitle>
          {children}
        </SheetContent>
      </Sheet>
      <div>
        <p className="font-heading text-base leading-tight font-bold">CATSA</p>
        <p className="text-xs text-sidebar-foreground/60">Panel administrativo</p>
      </div>
    </div>
  );
}

// setAbierto es estable: el efecto corre solo cuando cambia la ruta.
function AlNavegar({ setAbierto }: { setAbierto: (abierto: boolean) => void }) {
  const ruta = usePathname();
  useEffect(() => setAbierto(false), [ruta, setAbierto]);
  return null;
}
