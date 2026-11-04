# WEB-02 · Acceso al panel y configuración de 2FA

|             |                                        |
| ----------- | -------------------------------------- |
| Estado      | terminada                              |
| Repo        | Catsa-Web                              |
| Entregable  | Panel administrativo con acceso seguro |
| Responsable | KnotFix                                |
| Actualizada | 2026-11-02                             |
| Depende de  | WEB-01                                 |

## Qué es

Login en dos pasos, configuración de la 2FA con QR generado en el servidor, códigos de respaldo y recuperación de contraseña.

## Definición de terminado

- [x] Ninguna página del panel abre sin 2FA
- [x] Invitación y "¿Olvidó su contraseña?" llegan a `/admin/restablecer/<clave>`

## Avance

- 2026-11-02 · Se implementó `/admin/configurar-2fa` y `exigirPanel()` (`9d41e1c`).
- 2026-11-02 · Se agregó la recuperación de contraseña (`40b3b9b`).

## Artefactos

- `src/features/auth/`
- `src/app/admin/(acceso)/`

## Notas

Ninguna.
