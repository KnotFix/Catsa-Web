"use client";

import { useActionState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { activarDosPasos } from "../actions";
import { CodigosRespaldo } from "./codigos-respaldo";

/** Clave en grupos de 4 para copiarla a mano sin perderse. */
const agrupar = (secreto: string) => secreto.match(/.{1,4}/g)?.join(" ") ?? secreto;

export function Configurar2fa({ qr, secreto }: { qr: string; secreto: string }) {
  const [estado, accion, enviando] = useActionState(activarDosPasos, undefined);

  if (estado?.codigos) return <CodigosRespaldo codigos={estado.codigos} />;

  return (
    <ol className="grid gap-6 text-sm text-catsa-body">
      <li>
        <p className="font-semibold text-catsa-ink">1. Instale una app de autenticación</p>
        <p className="mt-1">Google Authenticator, Microsoft Authenticator o similar, en su teléfono.</p>
      </li>
      <li>
        <p className="font-semibold text-catsa-ink">2. Escanee este código con la app</p>
        {/* SVG generado en nuestro servidor a partir del secreto (features/auth/server/qr.ts). */}
        <div
          className="mx-auto mt-3 size-44 rounded-lg border bg-white p-1 [&_svg]:size-full"
          role="img"
          aria-label="Código QR para la app de autenticación"
          dangerouslySetInnerHTML={{ __html: qr }}
        />
        <details className="mt-3">
          <summary className="cursor-pointer text-catsa-green">¿No puede escanearlo?</summary>
          <p className="mt-2">Escriba esta clave en la app:</p>
          <code className="mt-1 block rounded-md bg-catsa-field px-3 py-2 font-mono text-xs break-all text-catsa-ink select-all">
            {agrupar(secreto)}
          </code>
        </details>
      </li>
      <li>
        <p className="font-semibold text-catsa-ink">3. Escriba el código que muestra la app</p>
        <form action={accion} className="mt-3 grid gap-4">
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
            aria-label="Código de 6 dígitos"
            containerClassName="justify-center"
          >
            <InputOTPGroup>
              {Array.from({ length: 6 }, (_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <Button type="submit" size="lg" disabled={enviando}>
            {enviando ? "Activando…" : "Activar verificación en dos pasos"}
          </Button>
        </form>
      </li>
    </ol>
  );
}
