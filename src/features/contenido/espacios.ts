import { z } from "zod";

export type Espacio<T> = { clave: string; esquema: z.ZodType<T>; porDefecto: T };

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
    titulo: "Cultivamos Guanacaste desde 1975.",
    texto:
      "Empresa agroindustrial guanacasteca dedicada al cultivo y procesamiento de caña de azúcar y a la producción de azúcares y alcoholes.",
  },
};

const esquemaEncabezado = z.object({ antetitulo: z.string(), titulo: z.string(), bajada: z.string() });
const esquemaCierre = z.object({ antetitulo: z.string(), titulo: z.string(), texto: z.string() });

export type DatosEncabezado = z.infer<typeof esquemaEncabezado>;
export type DatosCierre = z.infer<typeof esquemaCierre>;

/** Encabezado de una página interior. Django lo declara con encabezado() en espacios.py. */
function encabezado(pagina: string, porDefecto: DatosEncabezado): Espacio<DatosEncabezado> {
  return { clave: `${pagina}.encabezado`, esquema: esquemaEncabezado, porDefecto };
}

/** Franja de cierre de una página. Los botones y sus enlaces quedan en el código. */
function cierre(pagina: string, porDefecto: DatosCierre): Espacio<DatosCierre> {
  return { clave: `${pagina}.cierre`, esquema: esquemaCierre, porDefecto };
}

const imagen = z.object({ url: z.string(), alt: z.string(), ancho: z.number(), alto: z.number() });

export const espacioInicioGuanacastequidad = {
  clave: "inicio.guanacastequidad",
  esquema: z.object({
    antetitulo: z.string(),
    titulo: z.string(),
    texto: z.string(),
    // Sin foto (o si se borró de la biblioteca), la página usa la del diseño.
    foto: imagen.nullable().default(null),
  }),
  porDefecto: {
    antetitulo: "Nuestra guanacastequidad",
    titulo: "Lo mejor de Guanacaste es su gente y su cultura.",
    texto:
      "Guanacaste nos vio nacer como empresa en 1975 y vio nacer a gran parte de quienes trabajan con nosotros. Celebramos el Día de la Anexión con sus comidas, bailes y tradiciones, y damos trabajo a más de 450 colaboradores permanentes y a más de 1.000 personas en zafra.",
    foto: null,
  },
};

export const espacioInicioCierre = cierre("inicio", {
  antetitulo: "Hablemos",
  titulo: "Hablemos de lo que produce Guanacaste.",
  texto:
    "Solicite información sobre nuestros productos, certificaciones u oportunidades comerciales. Le respondemos con gusto.",
});

export const espacioSobreEncabezado = encabezado("sobre-nosotros", {
  antetitulo: "Quiénes somos",
  titulo: "Una empresa con raíces en Guanacaste desde 1975.",
  bajada:
    "Somos una empresa agroindustrial dedicada al cultivo y procesamiento de la caña de azúcar y a la producción de azúcares y alcoholes.",
});

export const espacioSobreMisionVision = {
  clave: "sobre-nosotros.mision-vision",
  esquema: z.object({ mision: z.string(), vision: z.string() }),
  porDefecto: {
    mision:
      "Somos una empresa agroindustrial que transforma la caña de azúcar de manera sostenible, en productos que generan bienestar a las partes interesadas.",
    vision:
      "Seremos la empresa líder en productividad y rentabilidad de la agroindustria azucarera nacional.",
  },
};

export const espacioSobreCierre = cierre("sobre-nosotros", {
  antetitulo: "Trabaje con nosotros",
  titulo: "Sea parte de la historia de CATSA.",
  texto:
    "Somos una de las principales fuentes de empleo de Guanacaste. Conozca nuestras oportunidades laborales.",
});

export const espacioAreasEncabezado = encabezado("areas", {
  antetitulo: "La empresa por dentro",
  titulo: "Nuestras áreas",
  bajada:
    "Cuatro áreas conectadas por un mismo compromiso con la caña, desde el campo guanacasteco hasta el producto final.",
});

export const espacioAreasCierre = cierre("areas", {
  antetitulo: "Desde 1975",
  titulo: "Cuatro áreas, un mismo compromiso.",
  texto: "Así convertimos la caña guanacasteca en productos de clase mundial. Conozca el recorrido completo.",
});

export const espacioComoEncabezado = encabezado("como-trabajamos", {
  antetitulo: "Nuestro proceso",
  titulo: "De la caña al azúcar",
  bajada:
    "Siga el recorrido de la caña guanacasteca por cada fase de producción, hasta convertirse en azúcar y alcohol de clase mundial.",
});

export const espacioComoCierre = cierre("como-trabajamos", {
  antetitulo: "Calidad garantizada",
  titulo: "Siete fases, un mismo estándar de calidad.",
  texto:
    "Todo el recorrido opera bajo certificaciones internacionales que respaldan cada grano que producimos.",
});

export const espacioProductosEncabezado = encabezado("productos", {
  antetitulo: "Productos",
  titulo: "Azúcar, alcohol, miel y arroz para el mercado nacional e internacional.",
  bajada:
    "El azúcar se comercializa por medio de LAICA. Explore cada producto con su código y su ficha técnica.",
});

export const espacioProductosCierre = cierre("productos", {
  antetitulo: "Cotizaciones",
  titulo: "¿Necesita alcohol, miel o información de nuestros azúcares?",
  texto: "Solicite la ficha técnica de cualquier producto o una cotización a la medida de su industria.",
});

export const espacioCertificacionesEncabezado = encabezado("certificaciones", {
  antetitulo: "Calidad garantizada",
  titulo: "Certificaciones que respaldan cada grano",
  bajada:
    "Nuestros procesos son auditados por entes certificadores independientes que garantizan la calidad e inocuidad de cada producto.",
});

export const espacioCertificacionesCierre = cierre("certificaciones", {
  antetitulo: "Respaldo internacional",
  titulo: "Calidad certificada en cada grano.",
  texto:
    "Solicite los certificados vigentes o más información sobre nuestros procesos de calidad e inocuidad.",
});

export const espacioRseEncabezado = encabezado("rse", {
  antetitulo: "Responsabilidad social empresarial",
  titulo: "Sembramos comunidad.",
  bajada:
    "Somos un «puente de unión» con las comunidades vecinas, donde también viven nuestros colaboradores: Guardia, Palmira, El Paso Tempisque e Irigaray.",
});

export const espacioRseCierre = cierre("rse", {
  antetitulo: "Nuestro compromiso",
  titulo: "Cada grano de azúcar deja algo en Guanacaste.",
  texto:
    "Así retribuimos a la tierra y a la gente que hacen posible a CATSA. ¿Tiene una iniciativa para la comunidad?",
});

export const espacioNoticiasEncabezado = encabezado("noticias", {
  antetitulo: "Noticias",
  titulo: "Lo último de CATSA",
  bajada: "",
});

export const espacioPuestosEncabezado = encabezado("puestos", {
  antetitulo: "Trabaje con nosotros",
  titulo: "Puestos disponibles",
  bajada: "Las mismas vacantes que compartimos en redes, con toda la información en un solo lugar.",
});

export const espacioContactoEncabezado = encabezado("contacto", {
  antetitulo: "Hablemos",
  titulo: "Contáctenos",
  bajada: "Estamos a la orden para atender sus consultas comerciales, de calidad o institucionales.",
});

export const espacioContactoCierre = cierre("contacto", {
  antetitulo: "Trabaje con nosotros",
  titulo: "¿Busca sumarse al equipo?",
  texto: "Somos una de las principales fuentes de empleo de Guanacaste. Conozca las vacantes abiertas.",
});

const ESPACIOS: { clave: string; porDefecto: object }[] = [
  espacioInicioHero,
  espacioInicioGuanacastequidad,
  espacioInicioCierre,
  espacioSobreEncabezado,
  espacioSobreMisionVision,
  espacioSobreCierre,
  espacioAreasEncabezado,
  espacioAreasCierre,
  espacioComoEncabezado,
  espacioComoCierre,
  espacioProductosEncabezado,
  espacioProductosCierre,
  espacioCertificacionesEncabezado,
  espacioCertificacionesCierre,
  espacioRseEncabezado,
  espacioRseCierre,
  espacioNoticiasEncabezado,
  espacioPuestosEncabezado,
  espacioContactoEncabezado,
  espacioContactoCierre,
];

/** Texto del diseño de cada espacio, por clave. El panel lo ofrece como punto de partida. */
export const porDefectoDeEspacios: Record<string, Record<string, unknown>> = Object.fromEntries(
  ESPACIOS.map((e) => [e.clave, e.porDefecto as Record<string, unknown>]),
);
