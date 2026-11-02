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
