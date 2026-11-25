# WEB-13 · Control de calidad y publicación

|             |                                  |
| ----------- | -------------------------------- |
| Estado      | en curso                         |
| Repo        | Catsa-Web                        |
| Entregable  | Control de calidad y publicación |
| Responsable | KnotFix                          |
| Actualizada | 2026-11-22                       |
| Depende de  | WEB-10, WEB-11, WEB-12           |

## Qué es

Verificación de salida: todas las páginas, panel, accesibilidad, rendimiento, vistas previas al compartir y 2FA activa.

## Definición de terminado

- [ ] Lista de verificación de salida firmada

## Avance

- 2026-11-04 · Se preparó el build para Dokploy: `SITE_URL`, `MEDIA_URL` e `INDEXAR` como argumentos de build; el sitio queda fuera de buscadores salvo en producción (`INDEXAR=true`) (`11a35a3`). Falta el control de calidad final y la publicación.

## Artefactos

- `Dockerfile` y configuración de build (commit `11a35a3`)

## Notas

- Va de la mano con API-11 y API-12 en Catsa-Api.
