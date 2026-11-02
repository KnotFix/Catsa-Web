"use client";

import { useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Campo, conError } from "@/components/shared/campo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { subirMedio } from "../actions";
import type { Medio, TipoMedio } from "../types";

const ACEPTA: Record<TipoMedio | "todos", string> = {
  imagen: "image/jpeg,image/png,image/webp",
  pdf: "application/pdf",
  todos: "image/jpeg,image/png,image/webp,application/pdf",
};
const PESO_MAXIMO = 10 * 1024 * 1024;

/**
 * Formulario de subida. El texto alternativo se pide solo para imágenes, que
 * es cuando Django lo exige. Lo que llega se vuelve a revisar en el servidor.
 */
export function SubirMedio({ tipo, onSubido }: { tipo?: TipoMedio; onSubido?: (medio: Medio) => void }) {
  const id = useId();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [subiendo, iniciar] = useTransition();
  const formulario = useRef<HTMLFormElement>(null);
  const esImagen = archivo?.type.startsWith("image/") ?? tipo === "imagen";

  function enviar(datos: FormData) {
    if (archivo && archivo.size > PESO_MAXIMO) {
      setErrores({ archivo: "El archivo pesa más de 10 MB." });
      return;
    }
    iniciar(async () => {
      const resultado = await subirMedio(datos);
      if (!resultado.ok) {
        setErrores(
          resultado.campos && Object.keys(resultado.campos).length
            ? resultado.campos
            : { archivo: resultado.error },
        );
        return;
      }
      setErrores({});
      setArchivo(null);
      formulario.current?.reset();
      toast.success("Archivo subido");
      onSubido?.(resultado.datos);
    });
  }

  return (
    <form
      ref={formulario}
      className="grid gap-4"
      onSubmit={(e) => {
        // Sin `action`: React vaciaría el formulario aunque la subida falle.
        e.preventDefault();
        enviar(new FormData(e.currentTarget));
      }}
    >
      <Campo
        id={`${id}-archivo`}
        etiqueta="Archivo"
        ayuda="JPG, PNG, WebP o PDF. Hasta 10 MB."
        error={errores.archivo}
      >
        <Input
          id={`${id}-archivo`}
          name="archivo"
          type="file"
          accept={ACEPTA[tipo ?? "todos"]}
          required
          onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
          {...conError(`${id}-archivo`, errores.archivo)}
        />
      </Campo>
      {esImagen && (
        <Campo
          id={`${id}-alt`}
          etiqueta="Texto alternativo"
          ayuda="Describa la imagen para quien no puede verla. Ej.: «Cosechadora en un cañal al atardecer»."
          error={errores.alt}
        >
          <Textarea
            id={`${id}-alt`}
            name="alt"
            maxLength={200}
            rows={2}
            required
            {...conError(`${id}-alt`, errores.alt)}
          />
        </Campo>
      )}
      <Button type="submit" disabled={subiendo} className="justify-self-start">
        {subiendo ? "Subiendo…" : "Subir"}
      </Button>
    </form>
  );
}
