import type { Route } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PESTANAS = [
  { clave: "usuarios", titulo: "Usuarios", href: "/admin/usuarios" },
  { clave: "accesos", titulo: "Registro de accesos", href: "/admin/usuarios/accesos" },
  { clave: "cambios", titulo: "Historial de cambios", href: "/admin/usuarios/cambios" },
  { clave: "ajustes", titulo: "Ajustes del sitio", href: "/admin/usuarios/ajustes" },
] as const satisfies { clave: string; titulo: string; href: Route }[];

/** Las secciones del módulo Administración. */
export function PestanasAdministracion({ activa }: { activa: (typeof PESTANAS)[number]["clave"] }) {
  return (
    <nav
      aria-label="Administración"
      className="mb-6 flex w-fit max-w-full gap-1 overflow-x-auto rounded-lg bg-card p-1"
    >
      {PESTANAS.map((p) => (
        <Link
          key={p.clave}
          href={p.href}
          aria-current={activa === p.clave ? "page" : undefined}
          className={cn(
            "shrink-0 rounded-md px-3 py-1.5 text-sm font-semibold",
            activa === p.clave ? "bg-catsa-ink text-white" : "text-catsa-body hover:bg-catsa-cream",
          )}
        >
          {p.titulo}
        </Link>
      ))}
    </nav>
  );
}
