# WEB-10 · Datos por confirmar con CATSA

|             |                                   |
| ----------- | --------------------------------- |
| Estado      | bloqueada                         |
| Repo        | Catsa-Web                         |
| Entregable  | Rediseño de las páginas del sitio |
| Responsable | KnotFix                           |
| Actualizada | 2026-11-03                        |
| Depende de  | CATSA                             |

## Qué es

Datos del sitio que salen de catsa.net pero no coinciden entre sí o no se pueden verificar.

## Definición de terminado

- [ ] Cada punto confirmado por escrito por CATSA y corregido en el sitio

## Avance

- 2026-11-03 · Se detectaron inconsistencias al pasar el contenido real. Bloqueada: depende de que CATSA confirme los datos.

## Artefactos

- `src/features/sitio/productos.ts`
- `src/app/(sitio)/sobre-nosotros/page.tsx`
- `src/features/sitio/imagenes.ts`

## Notas

- Las fichas de los dos alcoholes en catsa.net están cruzadas y ambas dicen LB-2401; el anhidro quedó como LB-2402 (inferido).
- Hectáreas: 10.551 en una página y 12.000 en otra; el sitio usa 10.551.
- BONSUCRO no aparece entre los sellos actuales.
- Las fotos de RSE y algunas de áreas son de 550 px: hacen falta originales.
