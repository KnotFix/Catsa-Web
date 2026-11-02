// Provisional, escrito a mano. Se reemplaza por el tipo generado del OpenAPI
// cuando Catsa-Api publique el endpoint (npm run api:tipos).
export type PuestoResumen = {
  slug: string;
  titulo: string;
  area: string;
  ubicacion: string;
  cierra_el: string | null;
};

export type Puesto = PuestoResumen & {
  /** HTML ya sanitizado por Django. */
  descripcion: string;
  /** Cómo aplicar: correo o enlace externo, lo define RR. HH. */
  como_aplicar: string;
};
