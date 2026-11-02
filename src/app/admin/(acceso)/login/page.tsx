import type { Metadata } from "next";
import { FormularioLogin } from "@/features/auth/components/formulario-login";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <>
      <h1 className="mt-6 text-xl text-catsa-ink">Panel administrativo</h1>
      <p className="mt-1 mb-6 text-sm text-catsa-muted">Ingrese con su cuenta de CATSA.</p>
      <FormularioLogin />
    </>
  );
}
