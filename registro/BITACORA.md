# Bitácora · Catsa-Web

Qué pasó y cuándo. Solo se agrega al final; si algo quedó mal, una entrada nueva lo corrige.
La escribe el agente `registro`. Las decisiones que CATSA aprueba van a la bitácora técnica del cliente (D-###).

## 2026-11-02

- **WEB-01 · Estructura inicial y CI**: Se creó la estructura inicial con login BFF, permisos por módulo y caché revalidable (`b403656`).
- **WEB-01 · Estructura inicial y CI**: El CI pasó a correr también en la rama `dev` (`923f395`).
- **WEB-02 · Acceso al panel y configuración de 2FA**: Se implementó `/admin/configurar-2fa` y `exigirPanel()` (`9d41e1c`).
- **WEB-02 · Acceso al panel y configuración de 2FA**: Se agregó la recuperación de contraseña (`40b3b9b`).
- **WEB-03 · Sitio conectado a la API: noticias, puestos y espacios**: Se conectaron noticias, puestos y espacios con `src/types/api.d.ts` generado (`6961b0b`).
- **WEB-04 · Panel: medios, noticias, puestos y contenido**: Se implementaron los módulos del panel con `apiPanel()` e `intentar()` (`cf93cf7`).
- **WEB-05 · Panel: Administración e historial de cambios**: Se implementó Administración con usuarios y registro de accesos (`40b3b9b`).
- **WEB-05 · Panel: Administración e historial de cambios**: Se agregó la pestaña Historial de cambios (`5b8b02c`).
- **WEB-06 · Ajustes del sitio en el panel y el pie**: Se agregaron los ajustes al panel y al pie (`7198663`).
- **WEB-06 · Ajustes del sitio en el panel y el pie**: Se corrigió el build para que no dependa de la API (`f2fdefb`).
- **WEB-07 · Sitio público con el diseño aprobado**: Se portó el boceto aprobado a las 13 páginas (`dfab6da`).

## 2026-11-03

- **WEB-08 · Fotos propias y datos reales de CATSA**: Se copiaron las fotos a `public/sitio/` y se reescribió el contenido con datos reales; fichas de 9 productos (`abb1aca`).
- **WEB-09 · Cifras, entradas y salidas**: Se movieron las cifras a Sobre nosotros y se agregaron las entradas y salidas de página (`4b10774`).
- **WEB-10 · Datos por confirmar con CATSA**: Se detectaron inconsistencias al pasar el contenido real. Bloqueada: depende de que CATSA confirme los datos.
- Se creó `registro/` con el tablero, esta bitácora y una card por cada parte del trabajo hecho hasta hoy, reconstruidas desde el historial de commits.
