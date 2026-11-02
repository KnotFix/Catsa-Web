import Image from "next/image";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Medio } from "../types";

/** Miniatura cuadrada de un medio: la imagen recortada o un ícono de PDF. */
export function VistaMedio({ medio, className }: { medio: Medio; className?: string }) {
  return (
    <div className={cn("relative aspect-square overflow-hidden rounded-lg bg-catsa-cream-2", className)}>
      {medio.tipo === "imagen" ? (
        <Image src={medio.url} alt={medio.alt} fill sizes="200px" className="object-cover" />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 p-3 text-catsa-brown">
          <FileText className="size-10" aria-hidden />
          <span className="line-clamp-2 text-center text-xs break-all text-catsa-body">{medio.nombre}</span>
        </div>
      )}
    </div>
  );
}
