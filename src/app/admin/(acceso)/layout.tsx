// Pantallas de acceso al panel: sin barra lateral, tarjeta centrada.
export default function AccesoLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-catsa-cream px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-sm">
        <p className="font-heading text-lg font-bold text-catsa-green">CATSA</p>
        {children}
      </div>
    </main>
  );
}
