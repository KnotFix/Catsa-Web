import { BarraLateral } from "@/components/layout/panel/barra-lateral";

// Todo lo que está dentro de (panel) exige sesión: el proxy redirige sin
// cookie y cada página valida su módulo con <Protegido>.
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 bg-catsa-field">
      <BarraLateral />
      <main id="contenido" className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
