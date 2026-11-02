import { z } from "zod";

// Un esquema por espacio editable. Django declara los mismos campos, con sus
// límites, en apps/contenido/espacios.py; de ahí sale el formulario del panel.
// Los valores por defecto son el texto del diseño aprobado: el sitio los usa
// mientras nadie edite el espacio y el panel los ofrece como punto de partida.

export const espacioInicioHero = {
  clave: "inicio.hero",
  esquema: z.object({
    antetitulo: z.string(),
    titulo: z.string(),
    texto: z.string(),
  }),
  porDefecto: {
    antetitulo: "Central Azucarera Tempisque",
    titulo: "Sitio en construcción",
    texto: "Base del nuevo sitio de CATSA. Las secciones se arman a partir de la API y del diseño aprobado.",
  },
};

/** Texto del diseño de cada espacio, por clave. Al agregar un espacio, sumarlo aquí. */
export const porDefectoDeEspacios: Record<string, Record<string, unknown>> = {
  [espacioInicioHero.clave]: espacioInicioHero.porDefecto,
};
