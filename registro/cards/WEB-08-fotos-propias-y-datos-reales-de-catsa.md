# WEB-08 · Fotos propias y datos reales de CATSA

|             |                                   |
| ----------- | --------------------------------- |
| Estado      | terminada                         |
| Repo        | Catsa-Web                         |
| Entregable  | Rediseño de las páginas del sitio |
| Responsable | KnotFix                           |
| Actualizada | 2026-11-03                        |
| Depende de  | WEB-07                            |

## Qué es

Fotos de catsa.net copiadas al proyecto en WebP y contenido real: catálogo con fichas por producto, áreas, proceso, RSE, certificaciones y contacto.

## Definición de terminado

- [x] Ninguna imagen se carga desde catsa.net
- [x] Una ficha por producto en `/productos/[slug]`

## Avance

- 2026-11-03 · Se copiaron las fotos a `public/sitio/` y se reescribió el contenido con datos reales; fichas de 9 productos (`abb1aca`).

## Artefactos

- `src/features/sitio/imagenes.ts`
- `src/features/sitio/productos.ts`
- `src/app/(sitio)/productos/[slug]/`

## Notas

- Los datos por confirmar con CATSA quedaron en WEB-10.
