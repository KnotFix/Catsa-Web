import type { ReactNode } from "react";
import type { Color } from "@/lib/api/tipos";
import { etiquetaColor } from "@/lib/colores";
import { cn } from "@/lib/utils";

/** Categoría de noticia o área de puesto, con su color de la paleta. */
export function Etiqueta({ color = "verde", children }: { color?: Color; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        etiquetaColor[color],
      )}
    >
      {children}
    </span>
  );
}
