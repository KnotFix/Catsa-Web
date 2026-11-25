# WEB-02 · Acceso al panel y configuración de 2FA

|             |                                        |
| ----------- | -------------------------------------- |
| Estado      | terminada                              |
| Repo        | Catsa-Web                              |
| Entregable  | Panel administrativo con acceso seguro |
| Responsable | KnotFix                                |
| Actualizada | 2026-11-19                             |
| Depende de  | WEB-01                                 |

## Qué es

Login en dos pasos, configuración de la 2FA con QR generado en el servidor, códigos de respaldo y recuperación de contraseña.

## Definición de terminado

- [x] Ninguna página del panel abre sin 2FA
- [x] Invitación y "¿Olvidó su contraseña?" llegan a `/admin/restablecer/<clave>`

## Avance

- 2026-11-02 · Se implementó `/admin/configurar-2fa` y `exigirPanel()` (`9d41e1c`).
- 2026-11-02 · Se agregó la recuperación de contraseña (`40b3b9b`).
- 2026-11-19 · `datosDelVisitante()` manda a Django la IP que anota el proxy (`X-Real-IP` o el último valor de `X-Forwarded-For`) en lugar del primer valor, que el visitante puede inventar y con el que evitaba el bloqueo por intentos fallidos. Es parte de la revisión de seguridad registrada como API-14 en Catsa-Api (`3428696`).

## Artefactos

- `src/features/auth/`
- `src/app/admin/(acceso)/`
- `src/features/auth/server/allauth.ts`

## Notas

- Falta confirmar en el ambiente dev de Dokploy que el registro de accesos muestra la IP real del visitante.
