import { z } from "zod";

// Un esquema por espacio editable. El mismo esquema existe en Django (JSON
// Schema) y genera el formulario del panel. Los valores por defecto son el
// texto del diseño aprobado.

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
