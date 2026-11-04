# Catsa-Web · instrucciones para Claude Code

Sitio público y panel administrativo de CATSA. Cliente: **Central Azucarera Tempisque S.A.** Estudio:
**KnotFix**. Alcance: **Propuesta 3** (rediseño + noticias + puestos). La API vive en el repo hermano
`../Catsa-Api` (KnotFix/Catsa-Api).

Las reglas de Next.js 16 (las escribe `next dev`) y el README con el stack, la arquitectura y las
convenciones se cargan aquí:

@AGENTS.md

@README.md

---

## Reglas de trabajo

1. **Solo la rama `dev`.** Todo se commitea y se sube a `dev`. `main` se toca únicamente cuando se pide.
2. **Nada de commit ni push sin el OK explícito** de quien lleva la sesión.
3. **`.env.local` nunca se sube**, ni se escriben contraseñas o tokens en el chat, en commits ni en el
   registro.
4. **Ninguna card se da por terminada sin registrarla.** Ver _Registro de avance_.
5. **Las decisiones van a la bitácora del cliente**, no a este repo:
   `Documentación de Proyecto/fuente/Bitacora_Tecnica_CATSA.json` (IDs `D-###`). La bitácora la lee CATSA:
   nada interno.
6. **Commits en español**, en una línea que diga qué cambió para quien usa el sitio o el panel.
7. Textos del sitio y del panel en español y de **usted**, como los que ya existen.
8. **Antes de reportar**, lo mismo que corre el CI: `npm run format:check`, `npm run lint`,
   `npm run typecheck` y `npm run build`.

## Registro de avance

El avance se lleva por escrito en `registro/`:

| Archivo                             | Qué es                                                                      |
| ----------------------------------- | --------------------------------------------------------------------------- |
| `registro/TABLERO.md`               | Todas las cards de este repo con su estado. La foto del momento.            |
| `registro/BITACORA.md`              | Qué pasó y cuándo. Solo se agrega al final, nunca se edita.                 |
| `registro/cards/WEB-<nn>-<slug>.md` | Ficha de cada card: qué es, cuándo está terminada, avance, archivos, notas. |

Cuando una card empieza, avanza, se bloquea o se termina, se usa el agente **`registro`**:

```
Usa el agente registro para anotar que WEB-11 está en curso
```

Es el único que escribe en `registro/`. Las cards del API (`API-<nn>`) se registran en
`../Catsa-Api/registro/` con su propio agente.

## Agentes

| Agente          | Para qué                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------- |
| `registro`      | Anotar avance, bloqueos y cierres de cards. El único que escribe en `registro/`.             |
| `frontend-next` | Cards del sitio y del panel: páginas, features, Server Actions, caché, estilos y movimiento. |
| `qa-web`        | Verificar en un navegador real: móvil, movimiento, accesibilidad, panel por permisos, build. |

Los agentes viven en `.claude/agents/` y Claude Code los encuentra al abrir la sesión **dentro de este repo**
(o de una subcarpeta). Desde la carpeta `CATSA/` no se ven: abrir la sesión en `Catsa-App/Catsa-Web`.

Flujo: `frontend-next` o `qa-web` devuelven un bloque de reporte; la sesión principal se lo pasa a `registro`.
Ningún agente llama a otro.

## Estado actual

Ver `registro/TABLERO.md`. A tener presente:

- La API local tiene la **2FA en pausa** (solo desarrollo). El panel entra con la contraseña. Se reactiva
  antes de publicar (`../Catsa-Api/docs/pendientes-antes-de-produccion.md`).
- **WEB-10** está bloqueada: datos del sitio que CATSA tiene que confirmar.

## Lo que no hay que hacer

- Lógica en `app/`, `fetch` sueltos fuera de `lib/api/http.ts`, o una feature importando de otra.
- Editar `src/types/api.d.ts` a mano: se genera con `npm run api:tipos`.
- Hex sueltos, puntos de corte inventados o animaciones sin `ease-catsa` y sin respetar
  `prefers-reduced-motion`.
- Fotos desde catsa.net u otro dominio: van en `public/sitio/` y se registran en `features/sitio/imagenes.ts`.
- `dynamicParams` con Cache Components: las rutas que no existen se resuelven con `notFound()`.
