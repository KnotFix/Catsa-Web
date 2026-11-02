import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Etiqueta, ayuda, contador de caracteres y error de un campo del panel. El
 * control va como hijo y debe tener `id={id}`; el error se le asocia con
 * aria-describedby desde aquí con `idError(id)`.
 */
export function Campo({
  id,
  etiqueta,
  ayuda,
  error,
  largo,
  maximo,
  className,
  children,
}: {
  id: string;
  etiqueta: string;
  ayuda?: string;
  error?: string;
  /** Con `maximo`, muestra "45/120". */
  largo?: number;
  maximo?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <Label id={idEtiqueta(id)} htmlFor={id}>
          {etiqueta}
        </Label>
        {maximo !== undefined && largo !== undefined && (
          <span
            className={cn("text-xs tabular-nums", largo > maximo ? "text-catsa-danger" : "text-catsa-muted")}
          >
            {largo}/{maximo}
          </span>
        )}
      </div>
      {children}
      {ayuda && !error && <p className="text-xs text-catsa-muted">{ayuda}</p>}
      {error && (
        <p id={idError(id)} className="text-sm text-catsa-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export const idError = (id: string) => `${id}-error`;
/** Para controles que no son <input> (editor de texto, selector de archivos): se nombran con aria-labelledby. */
export const idEtiqueta = (id: string) => `${id}-etiqueta`;

/** Props de accesibilidad para el control de un <Campo> con error. */
export function conError(id: string, error?: string) {
  return error ? { "aria-invalid": true, "aria-describedby": idError(id) } : {};
}
