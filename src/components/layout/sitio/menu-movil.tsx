"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navegacionSitio } from "@/config/sitio";

/** Debajo de 1040 px la navegación no cabe en una fila y pasa a este menú. */
export function MenuMovil() {
  const [abierto, setAbierto] = useState(false);

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="nav:hidden" aria-label="Abrir menú">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-catsa-paper">
        <SheetTitle className="px-6 pt-6 font-heading text-catsa-green">Menú</SheetTitle>
        <nav aria-label="Principal">
          <ul className="grid gap-1 px-4">
            {navegacionSitio.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  onClick={() => setAbierto(false)}
                  className="block rounded-lg px-3 py-3 font-semibold text-catsa-body hover:bg-catsa-cream"
                >
                  {enlace.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
