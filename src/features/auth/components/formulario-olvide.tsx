"use client";

import { useActionState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { solicitarRestablecer } from "../actions";

export function FormularioOlvide() {
  const [estado, accion, enviando] = useActionState(solicitarRestablecer, undefined);

  return (
    <form action={accion} className="grid gap-5">
      {estado?.error && (
        <Alert variant="destructive">
          <AlertDescription>{estado.error}</AlertDescription>
        </Alert>
      )}
      <div className="grid gap-2">
        <Label htmlFor="email">Correo</Label>
        <Input id="email" name="email" type="email" autoComplete="username" required autoFocus />
      </div>
      <Button type="submit" size="lg" disabled={enviando}>
        {enviando ? "Enviando…" : "Enviar enlace"}
      </Button>
    </form>
  );
}
