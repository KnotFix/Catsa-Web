"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/**
 * Se muestran una sola vez, justo después de activar la 2FA. Sirven para
 * entrar si el usuario pierde el teléfono; cada código se usa una vez.
 */
export function CodigosRespaldo({ codigos }: { codigos: string[] }) {
  const [copiado, setCopiado] = useState(false);
  const [guardados, setGuardados] = useState(false);
  const texto = codigos.join("\n");

  async function copiar() {
    await navigator.clipboard.writeText(texto);
    setCopiado(true);
  }

  function descargar() {
    const contenido = `Códigos de respaldo · Panel CATSA\nCada código sirve una sola vez.\n\n${texto}\n`;
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(new Blob([contenido], { type: "text/plain" }));
    enlace.download = "codigos-respaldo-catsa.txt";
    enlace.click();
    URL.revokeObjectURL(enlace.href);
  }

  return (
    <div className="grid gap-5">
      <Alert>
        <Check className="text-catsa-green" />
        <AlertTitle>Verificación en dos pasos activada</AlertTitle>
        <AlertDescription>
          Guarde estos códigos. Si pierde el teléfono, son la única forma de entrar. No se vuelven a mostrar.
        </AlertDescription>
      </Alert>

      {codigos.length > 0 ? (
        <ul className="grid grid-cols-2 gap-2 rounded-lg bg-catsa-field p-4 font-mono text-sm text-catsa-ink">
          {codigos.map((c) => (
            <li key={c} className="text-center tracking-wider">
              {c}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-catsa-muted">
          No pudimos mostrar los códigos. Pida a un administrador que se los genere de nuevo.
        </p>
      )}

      {codigos.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" onClick={copiar}>
            {copiado ? <Check /> : <Copy />}
            {copiado ? "Copiados" : "Copiar"}
          </Button>
          <Button type="button" variant="outline" onClick={descargar}>
            <Download />
            Descargar
          </Button>
        </div>
      )}

      <label className="flex items-start gap-2 text-sm text-catsa-body">
        <input
          type="checkbox"
          checked={guardados}
          onChange={(e) => setGuardados(e.target.checked)}
          className="mt-0.5 size-4 accent-catsa-green"
        />
        Ya los guardé en un lugar seguro.
      </label>

      {/* Navegación completa: el panel vuelve a leer la sesión, ya con la 2FA activa. */}
      <Button asChild size="lg" className={guardados ? "" : "pointer-events-none opacity-50"}>
        <a href="/admin" aria-disabled={!guardados} tabIndex={guardados ? undefined : -1}>
          Entrar al panel
        </a>
      </Button>
    </div>
  );
}
