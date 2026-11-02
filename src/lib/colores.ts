import type { Color } from "@/lib/api/tipos";

/**
 * Cada color que se elige en el panel es un par texto/fondo del diseño. Así
 * una categoría o un área nunca queda con un color que no combine.
 */
export const etiquetaColor: Record<Color, string> = {
  verde: "bg-catsa-sprout-bg text-catsa-green-d",
  cafe: "bg-catsa-brown-bg text-catsa-brown",
  ambar: "bg-catsa-amber-bg text-catsa-amber-ink",
  neutro: "bg-catsa-cream-2 text-catsa-body",
};
