import { BarraLateral, BarraMovil } from "@/components/layout/panel/barra-lateral";
import { Toaster } from "@/components/ui/sonner";

// Todo lo que está dentro de (panel) exige sesión: el proxy redirige sin
// cookie y cada página valida su módulo con <Protegido>.
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-catsa-field tablet:flex-row">
      <BarraLateral />
      <BarraMovil />
      <main id="contenido" className="min-w-0 flex-1 p-4 movil:p-6 tablet:p-8">
        {children}
      </main>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
