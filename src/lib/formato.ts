const fecha = new Intl.DateTimeFormat("es-CR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Costa_Rica",
});

/**
 * "2026-11-02" o "2026-11-02T15:30:00Z" → "2 de noviembre de 2026".
 * Una fecha sin hora (cierre de un puesto) se toma a mediodía: si no, JS la lee
 * como medianoche UTC y en Costa Rica saldría el día anterior.
 */
export function formatearFecha(iso: string) {
  return fecha.format(new Date(iso.length === 10 ? `${iso}T12:00:00-06:00` : iso));
}
