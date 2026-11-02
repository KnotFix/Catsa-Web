import type { Esquemas } from "@/lib/api/tipos";

export type PuestoResumen = Esquemas["PuestoResumen"];
/**
 * `descripcion`, `requisitos` y `ofrecemos` son HTML ya limpio en Django (nh3).
 * `recibe_postulaciones` es falso si se cerró o pasó la fecha de cierre: la
 * página sigue respondiendo para no romper enlaces compartidos.
 */
export type Puesto = Esquemas["PuestoPublico"];
export type FiltrosPuestos = Esquemas["FiltrosDisponibles"];
export type FiltrosElegidos = { area?: string; ubicacion?: string };

// --- Panel ------------------------------------------------------------------

export type EstadoPuesto = Esquemas["EstadoPuesto"];
export type TipoContrato = Esquemas["TipoContratoEnum"];
export type PuestoPanel = Esquemas["PuestoPanel"];
export type PuestoDetallePanel = Esquemas["PuestoDetallePanel"];
export type AreaPanel = Esquemas["Area"];
export type PuestoEntrada = {
  titulo: string;
  area: number;
  ubicacion: string;
  tipo_contrato: TipoContrato;
  resumen: string;
  descripcion: string;
  requisitos: string;
  ofrecemos: string;
  ficha: number | null;
  correo_contacto: string;
  cierra_el: string | null;
};

export const estadosPuesto: Record<EstadoPuesto, string> = {
  borrador: "Borrador",
  abierto: "Abierto",
  cerrado: "Cerrado",
};

/** Mismas etiquetas que Puesto.Contrato en Catsa-Api. */
export const tiposContrato: Record<TipoContrato, string> = {
  indefinido: "Tiempo indefinido",
  plazo_fijo: "Plazo fijo",
  zafra: "Temporada de zafra",
  medio_tiempo: "Medio tiempo",
};
