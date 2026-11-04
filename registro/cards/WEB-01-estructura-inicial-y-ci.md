# WEB-01 · Estructura inicial y CI

|             |              |
| ----------- | ------------ |
| Estado      | terminada    |
| Repo        | Catsa-Web    |
| Entregable  | Base técnica |
| Responsable | KnotFix      |
| Actualizada | 2026-11-02   |
| Depende de  | —            |

## Qué es

Next.js 16 con Cache Components, Tailwind 4, shadcn/ui con los tokens de CATSA, arquitectura por features, cliente único hacia Catsa-Api, Dockerfile y CI.

## Definición de terminado

- [x] `npm run build` pasa
- [x] CI en verde en `main` y `dev`

## Avance

- 2026-11-02 · Se creó la estructura inicial con login BFF, permisos por módulo y caché revalidable (`b403656`).
- 2026-11-02 · El CI pasó a correr también en la rama `dev` (`923f395`).

## Artefactos

- `src/lib/api/`
- `src/features/auth/`
- `Dockerfile`
- `.github/workflows/ci.yml`

## Notas

Ninguna.
