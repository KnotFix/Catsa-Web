"use client";

import { useActionState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { crearContrasena } from "../actions";

export function FormularioNuevaClave({ clave, email }: { clave: string; email: string }) {
  const [estado, accion, enviando] = useActionState(crearContrasena.bind(null, clave), undefined);

  return (
    <form action={accion} className="grid gap-5">
      {estado?.error && (
        <Alert variant="destructive">
          <AlertDescription>{estado.error}</AlertDescription>
        </Alert>
      )}
      {/* Para que el gestor de contraseñas la guarde con el correo correcto. */}
      <input type="email" name="usuario" autoComplete="username" value={email} readOnly hidden />
      <div className="grid gap-2">
        <Label htmlFor="password">Contraseña nueva</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          autoFocus
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmar">Repítala</Label>
        <Input
          id="confirmar"
          name="confirmar"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
        />
      </div>
      <Button type="submit" size="lg" disabled={enviando}>
        {enviando ? "Guardando…" : "Guardar contraseña"}
      </Button>
    </form>
  );
}
