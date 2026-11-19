"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * <Image> para archivos subidos a la Biblioteca. Si el archivo no responde
 * (se borró del volumen, el servidor de medios no está), en vez del texto
 * alternativo suelto con el ícono roto del navegador queda un recuadro neutro.
 * El texto alternativo se conserva para lectores de pantalla.
 */
export function ImagenSubida({ className, alt, ...props }: ImageProps) {
  const [fallo, setFallo] = useState(false);

  if (!fallo) return <Image {...props} alt={alt} className={className} onError={() => setFallo(true)} />;

  const proporcion =
    !props.fill && props.width && props.height ? `${props.width} / ${props.height}` : undefined;

  return (
    <div
      role="img"
      aria-label={alt || "Imagen no disponible"}
      style={{ aspectRatio: proporcion }}
      className={cn(
        "flex items-center justify-center bg-catsa-cream-2 text-catsa-muted",
        props.fill ? "absolute inset-0" : "w-full",
        className,
      )}
    >
      <ImageOff className="size-8 opacity-60" aria-hidden />
    </div>
  );
}
