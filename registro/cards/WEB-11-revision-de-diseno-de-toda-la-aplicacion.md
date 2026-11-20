# WEB-11 · Revisión de diseño de toda la aplicación

|             |                                   |
| ----------- | --------------------------------- |
| Estado      | terminada                         |
| Repo        | Catsa-Web                         |
| Entregable  | Rediseño de las páginas del sitio |
| Responsable | KnotFix                           |
| Actualizada | 2026-11-19                        |
| Depende de  | —                                 |

## Qué es

Revisión completa del diseño del sitio y del panel, anunciada para después de tener el contenido real.

## Definición de terminado

- [x] Hallazgos priorizados y corregidos

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

## Artefactos

- Commit `a326f31` (Inicio y cifras de Sobre nosotros). Archivos exactos no informados en el parte.
- Commit `13bb5ae` (hallazgos 1 a 9): `components/layout/panel/menu-movil.tsx` (nuevo), `components/layout/panel/barra-lateral.tsx`, `app/admin/(panel)/layout.tsx`, `editor-noticia.tsx`, `formulario-puesto.tsx`, `components/ui/sheet.tsx`, `app/(sitio)/sitio.css`, `app/not-found.tsx`, `config/modulos.ts`, `inicio.css`.
- Commit `63df259` (hallazgos 10 a 12): `features/medios/components/imagen-subida.tsx` (nuevo), `tarjeta-noticia`, `articulo-noticia`, `bloques-noticia`, `vista-medio`, `app/(sitio)/noticias/[slug]/page.tsx`.
- Commit `40e59c3` (teclado): `components/layout/sitio/encabezado.tsx`, `sitio.css`, `features/sitio/components/explorador-productos.tsx`, `menu-movil.tsx`, `app/admin/(panel)/layout.tsx`.

## Notas

- 2026-11-19: Las pruebas de teclado fueron con teclado simulado en Chrome headless, no con un lector de pantalla real (NVDA o VoiceOver). Queda sin verificar con uno.
- 2026-11-19: Detalle menor sin corregir: cada editor de texto (Tiptap) suma 8 paradas de Tab por su barra de formato. Se podría dejar un solo punto de parada por barra, recorrido con flechas.
- 2026-11-19: Falsos positivos de las herramientas automáticas, no son defectos:
  - El contraste de `LB-1001` lo marca el verificador, que no maneja fondos translúcidos.
  - El indicador de foco de las tarjetas de cifras tiene una transición y la herramienta lo midió antes de que terminara.
  - `nextjs-portal` es solo el indicador de desarrollo de Next.
