"use client";

import { useActionState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { verificarCodigo } from "../actions";

export function FormularioCodigo() {
  const [estado, accion, enviando] = useActionState(verificarCodigo, undefined);

  return (
    <form action={accion} className="grid gap-5">
      {estado?.error && (
        <Alert variant="destructive">
          <AlertDescription>{estado.error}</AlertDescription>
        </Alert>
      )}
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
      <Button type="submit" size="lg" disabled={enviando}>
        {enviando ? "Verificando…" : "Verificar"}
      </Button>
    </form>
  );
}
