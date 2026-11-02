export function EstadoVacio({ titulo, descripcion }: { titulo: string; descripcion?: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-catsa-cream/50 px-6 py-14 text-center">
      <p className="font-heading font-semibold text-catsa-ink">{titulo}</p>
      {descripcion && <p className="mt-1 text-sm text-catsa-muted">{descripcion}</p>}
    </div>
  );
}
