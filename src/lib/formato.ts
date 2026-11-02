const fecha = new Intl.DateTimeFormat("es-CR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Costa_Rica",
});

/** "2026-11-02" → "2 de noviembre de 2026" */
export function formatearFecha(iso: string) {
  return fecha.format(new Date(iso));
}
