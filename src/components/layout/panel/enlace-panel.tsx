"use client";

import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/** Enlace de la barra lateral; se marca activo según la ruta actual. */
export function EnlacePanel({ href, children }: { href: Route; children: ReactNode }) {
  const ruta = usePathname();
  const activo = href === "/admin" ? ruta === href : ruta.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={activo ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-sidebar-accent",
        activo && "bg-sidebar-accent font-semibold text-sidebar-primary",
      )}
    >
      {children}
    </Link>
  );
}
