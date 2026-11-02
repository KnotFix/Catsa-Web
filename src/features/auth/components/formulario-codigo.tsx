"use client";

import { useActionState, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { verificarCodigo } from "../actions";

export function FormularioCodigo() {
  const [estado, accion, enviando] = useActionState(verificarCodigo, undefined);
  const [conRespaldo, setConRespaldo] = useState(false);

  return (
    <form action={accion} className="grid gap-5">
      {estado?.error && (
        <Alert variant="destructive">
          <AlertDescription>{estado.error}</AlertDescription>
        </Alert>
      )}

      {conRespaldo ? (
        <div className="grid gap-2">
          <Label htmlFor="codigo">Código de respaldo</Label>
          <Input
            id="codigo"
            name="codigo"
            inputMode="numeric"
            autoComplete="off"
            placeholder="12345678"
            className="text-center font-mono tracking-widest"
            required
            autoFocus
          />
        </div>
      ) : (
        <InputOTP
          name="codigo"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          autoComplete="one-time-code"
          autoFocus
          aria-label="Código de verificación"
          containerClassName="justify-center"
        >
          <InputOTPGroup>
            {Array.from({ length: 6 }, (_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      )}

      <Button type="submit" size="lg" disabled={enviando}>
        {enviando ? "Verificando…" : "Verificar"}
      </Button>
      <button
        type="button"
        onClick={() => setConRespaldo(!conRespaldo)}
        className="text-sm text-catsa-green underline-offset-4 hover:underline"
      >
        {conRespaldo ? "Usar el código de la app" : "¿Perdió el teléfono? Use un código de respaldo"}
      </button>
    </form>
  );
}
