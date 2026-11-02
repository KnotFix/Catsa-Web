"use client";

import { useActionState } from "react";
import { Campo, conError } from "@/components/shared/campo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { crearNoticia } from "../../actions";

export function FormularioNuevaNoticia() {
  const [estado, accion, creando] = useActionState(crearNoticia, undefined);
  const error = estado && !estado.ok ? (estado.campos?.titulo ?? estado.error) : undefined;

  return (
    <form action={accion} className="grid max-w-2xl gap-4">
      <Campo
        id="titulo"
        etiqueta="Título"
        error={error}
        ayuda="Hasta 120 caracteres. Se puede cambiar después."
      >
        <Input
          id="titulo"
          name="titulo"
          maxLength={120}
          required
          autoFocus
          className="h-11 text-lg"
          {...conError("titulo", error)}
        />
      </Campo>
      <Button type="submit" disabled={creando} className="justify-self-start">
        {creando ? "Creando…" : "Crear borrador"}
      </Button>
    </form>
  );
}
