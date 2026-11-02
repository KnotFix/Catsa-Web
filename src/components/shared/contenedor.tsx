import { cn } from "@/lib/utils";

/** Ancho máximo del sitio (1160 px) con el margen lateral de la demo. */
export function Contenedor({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1160px] px-7", className)} {...props} />;
}
