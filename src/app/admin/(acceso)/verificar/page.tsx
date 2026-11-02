import type { Metadata } from "next";
import { FormularioCodigo } from "@/features/auth/components/formulario-codigo";

export const metadata: Metadata = { title: "Verificación en dos pasos" };

export default function VerificarPage() {
  return (
    <>
      <h1 className="mt-6 text-xl text-catsa-ink">Verificación en dos pasos</h1>
      <p className="mt-1 mb-6 text-sm text-catsa-muted">
        Escriba el código de 6 dígitos de su aplicación de autenticación.
      </p>
      <FormularioCodigo />
    </>
  );
}
