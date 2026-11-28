# WEB-11 · Revisión de diseño de toda la aplicación

|             |                                   |
| ----------- | --------------------------------- |
| Estado      | en curso                          |
| Repo        | Catsa-Web                         |
| Entregable  | Rediseño de las páginas del sitio |
| Responsable | KnotFix                           |
| Actualizada | 2026-11-27                        |
| Depende de  | —                                 |

## Qué es

Revisión completa del diseño del sitio y del panel, anunciada para después de tener el contenido real.

## Definición de terminado

- [x] Hallazgos priorizados y corregidos
- [ ] Optimización visual del sitio público con los medios entregados por CATSA (reabierta el 2026-11-27)

## Avance

- 2026-11-19: Se rediseñó el Inicio con escaparate de productos y las cifras de Sobre nosotros en blanco con detalles en verde y dibujos de caña de azúcar (`a326f31`, ya en `dev`).
- 2026-11-19: Se revisaron 13 páginas del sitio y el panel `/admin`, en escritorio y en móvil, y después se probó la navegación con teclado.
- 2026-11-19: Se corrigieron los hallazgos 1 a 9 (`13bb5ae`):
  - Panel en móvil: el menú pasó a un Sheet y la barra lateral aparece solo desde tablet. La barra de herramientas fija de los editores ya no queda tapada por el encabezado móvil.
  - El botón de cierre del Sheet se anuncia como "Cerrar".
  - Se oculta el arte del encabezado `.ph-art` por debajo de 600px.
  - Contacto ya no deja una columna vacía cuando no hay datos (clase `.cx-grid.solo`).
  - La página 404 ahora tiene encabezado y pie del sitio y un botón a Contáctenos.
  - El inicio del panel muestra una tarjeta por módulo (`accesosPanel`).
  - Se agregaron títulos sr-only: h1 en los editores y h2 en los listados de Noticias y Puestos.
  - Más contraste en la etiqueta de los productos (fondo rgba(15,22,17,0.88)).
  - Los puntos del carrusel del inicio son botones de 44×44.
- 2026-11-19: Se corrigieron los hallazgos 10 a 12 (`63df259`):
  - Error de hidratación en el editor de noticias: las claves iniciales de los bloques ya no usan randomUUID.
  - Nuevo `ImagenSubida`: muestra un recuadro neutro cuando un archivo subido no carga. Se usa en la tarjeta, el artículo, los bloques y la vista de medio.
  - Enlaces para volver a Noticias arriba y abajo del detalle.
- 2026-11-19: Se corrigió la navegación con teclado (`40e59c3`):
  - El desplegable Nosotros se cierra con Escape y tiene `aria-expanded`.
  - Las pestañas de las fichas de producto se recorren con flechas, con tabindex móvil.
  - El menú móvil del panel abre con el foco en la página actual y se cierra al navegar.
  - Se agregó un salto al contenido en el panel.
- 2026-11-27: Se reabrió la card para la optimización visual del sitio público con las fotos y videos que entregó CATSA (`dbe8820`, ya en `dev`; format:check, lint, typecheck y build en verde; verificado en navegador en escritorio y móvil):
  - Medios: CATSA entregó un zip con 33 fotos y 7 videos (~880 MB). Las fotos se pasaron a WebP de 2400 px de lado mayor (574 MB → 12,5 MB) y quedaron fuera del repo, en `CATSA/Medios CATSA/optimizados/`. Solo se versionan las que usa el sitio.
  - Hero del inicio: video "Inicio época invierno" cortado antes del logo final, sin sonido, a 24 cuadros, en AV1 1920 (4,9 MB), H.264 1920 (6,5 MB) y H.264 1280 para móvil (3,4 MB). El póster optimizado es el LCP y el video entra encima al reproducirse. Botón de pausa (WCAG 2.2.2). Sin video con movimiento reducido o ahorro de datos.
  - Certificaciones del inicio: cinta a todo lo ancho con degradado a los lados y píldoras con logo, nombre y tema que llevan a `/certificaciones#<sello>`. Los sellos declaran su tamaño real: antes Next los pedía a 120 px y FSSC e ISCC se veían borrosos. En `/certificaciones`, tarjetas con sombreado y luz que sigue al puntero (componente `<Foco>`, clase `.foco`).
  - Áreas del inicio: el mosaico se cambió por cuatro paneles que se expanden al pasar el puntero (en móvil, apilados: el primer toque abre y el segundo navega), con fotos nuevas, cifras confirmadas (7.500 t/día, 95 % de cosecha mecánica) y temas.
  - Productos del inicio: la foto del escaparate se desliza dentro del marco con el scroll y tiene un halo desenfocado detrás. Se probó y se descartó una banda de foto con parallax antes del título porque al cliente no le gustó.
  - Sala de prensa del inicio: espacio arriba, noticia destacada grande y dos en fila. Las noticias sin portada llevan una foto de CATSA de respaldo.
  - Cierre de todas las páginas y pie: adaptación del componente "Meadow Rise Footer" (21st.dev): cielo crema y seis colinas de caña pintadas en canvas que suben entre neblina, luz que sigue al puntero y colores de los tokens `--catsa-*`. El texto del cierre sigue editable desde el panel. El pie lleva flores de línea tenues y una hojita al pasar por los enlaces.

## Artefactos

- Commit `a326f31` (Inicio y cifras de Sobre nosotros). Archivos exactos no informados en el parte.
- Commit `13bb5ae` (hallazgos 1 a 9): `components/layout/panel/menu-movil.tsx` (nuevo), `components/layout/panel/barra-lateral.tsx`, `app/admin/(panel)/layout.tsx`, `editor-noticia.tsx`, `formulario-puesto.tsx`, `components/ui/sheet.tsx`, `app/(sitio)/sitio.css`, `app/not-found.tsx`, `config/modulos.ts`, `inicio.css`.
- Commit `63df259` (hallazgos 10 a 12): `features/medios/components/imagen-subida.tsx` (nuevo), `tarjeta-noticia`, `articulo-noticia`, `bloques-noticia`, `vista-medio`, `app/(sitio)/noticias/[slug]/page.tsx`.
- Commit `40e59c3` (teclado): `components/layout/sitio/encabezado.tsx`, `sitio.css`, `features/sitio/components/explorador-productos.tsx`, `menu-movil.tsx`, `app/admin/(panel)/layout.tsx`.
- Commit `dbe8820` (optimización visual con medios de CATSA): `public/sitio/video/` (videos del hero), `src/features/sitio/components/portada.tsx`, `src/features/sitio/components/paneles-areas.tsx`, `src/features/noticias/respaldo.ts`, `src/components/sitio/pradera/` (`escena.ts`, `cielo-pradera.tsx`, `flores.tsx`), `src/components/sitio/cierre.tsx`, `pie.tsx`, componente `<Foco>` y clase `.foco` en `sitio.css`.

## Notas

- 2026-11-19: Las pruebas de teclado fueron con teclado simulado en Chrome headless, no con un lector de pantalla real (NVDA o VoiceOver). Queda sin verificar con uno.
- 2026-11-19: Detalle menor sin corregir: cada editor de texto (Tiptap) suma 8 paradas de Tab por su barra de formato. Se podría dejar un solo punto de parada por barra, recorrido con flechas.
- 2026-11-19: Falsos positivos de las herramientas automáticas, no son defectos:
  - El contraste de `LB-1001` lo marca el verificador, que no maneja fondos translúcidos.
  - El indicador de foco de las tarjetas de cifras tiene una transición y la herramienta lo midió antes de que terminara.
  - `nextjs-portal` es solo el indicador de desarrollo de Next.
- 2026-11-27: La card estaba terminada (revisión del 2026-11-19); se reabrió porque la optimización visual con los medios de CATSA es la continuación más cercana. Si se prefiere separarla, iría como card nueva (WEB-14).
- 2026-11-27: No se subieron portadas de noticias desde local: la base de dev es compartida, pero los archivos de medios no, y en Dokploy dev se verían rotas. Las portadas reales se suben desde el panel de cada ambiente.
- 2026-11-27: Pendiente de CATSA: logo de Esencial Costa Rica en mejor resolución (el original es de 255 px) y foto propia del Área Administrativa (sigue la de catsa.net).
- 2026-11-27: Los videos del hero (unos 15 MB) van en el repo. Si llegan más, conviene servirlos desde `/media/`.
- 2026-11-27: En modo desarrollo la pradera del cierre tarda unos segundos en pintarse.
