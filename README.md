# Catsa-Web

Sitio público y panel administrativo de CATSA (Central Azucarera Tempisque S.A.).
Todos los datos vienen de [Catsa-Api](https://github.com/KnotFix/Catsa-Api) (Django).

## Stack

- Next.js 16 (App Router, Cache Components) + React 19 + TypeScript estricto
- Tailwind CSS 4 + shadcn/ui (Radix)
- zod para validar entradas, variables de entorno y contenido editable
- Fuentes: Poppins (títulos) y Source Sans 3 (texto)

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre http://localhost:3000. El panel está en `/admin` y necesita Catsa-Api corriendo en `API_URL`.
Sin la API, el sitio público carga igual con estados vacíos y los textos por defecto.

| Script              | Para qué                                               |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Servidor de desarrollo                                 |
| `npm run build`     | Build de producción (salida `standalone` para Docker)  |
| `npm run lint`      | ESLint                                                 |
| `npm run typecheck` | Tipos de rutas + `tsc`                                 |
| `npm run format`    | Prettier (ordena también las clases de Tailwind)       |
| `npm run api:tipos` | Genera `src/types/api.d.ts` desde el OpenAPI de Django |

## Arquitectura

```
src/
  app/                    Solo rutas: páginas delgadas que componen features.
    (sitio)/              Sitio público. El grupo no aparece en la URL.
    admin/(acceso)/       Login y verificación 2FA (sin barra lateral).
    admin/(panel)/        Panel. Una carpeta por módulo de permisos.
    api/revalidar/        Webhook que llama Django al publicar.
  features/               Un dominio por carpeta. Aquí vive la lógica.
    auth/                 Sesión, 2FA, permisos por módulo.
      server/             Solo servidor: cookies, cliente allauth, DAL.
      components/         Formularios de acceso, <Protegido>.
      actions.ts          Server Actions (login, código, salir).
    noticias/  puestos/   api.ts (lecturas en caché), types.ts, components/
    contenido/            Espacios editables con esquema zod y texto por defecto.
  components/
    ui/                   shadcn. Se agregan con `npx shadcn@latest add`.
    layout/sitio|panel/   Encabezado, pie, barra lateral.
    shared/               Piezas reutilizables sin dominio.
  config/                 Navegación del sitio y módulos del panel.
  lib/
    api/                  Único cliente HTTP hacia Django, errores, etiquetas de caché.
    env.ts                Variables de entorno validadas (solo servidor).
  proxy.ts                Redirige /admin sin cookie (revisión optimista).
```

### Reglas

1. **`app/` no tiene lógica.** Una página importa de `features/*` y arma la vista.
2. **Toda llamada a Django pasa por `lib/api/http.ts`.** Nada de `fetch` sueltos.
3. **Lo que es solo servidor importa `server-only`.** Tokens, cookies y `env` nunca llegan al navegador.
4. **Una feature no importa de otra**, salvo `auth` (permisos). Lo compartido va a `components/shared` o `lib`.
5. **Datos con `Suspense`.** Cada bloque que lee datos va en su `<Suspense>` con esqueleto. Así la página sale estática y solo el bloque que falla espera.

### Datos y caché

- Las lecturas públicas (`features/*/api.ts`) usan `"use cache"` + `cacheTag`. Se quedan en caché hasta que
  Django llama a `POST /api/revalidar` con las etiquetas de `lib/api/etiquetas.ts`.
- Si la API no responde, `conRespaldo` devuelve un valor vacío de vida corta: la página no se rompe y se
  vuelve a intentar en segundos.
- Los espacios editables se validan con zod. Si el dato no calza, se usa el texto por defecto del diseño.

### Acceso al panel (BFF)

```
Navegador ──(cookie httpOnly)──▶ Next (Server Actions / RSC) ──(X-Session-Token)──▶ Django allauth
```

- El navegador nunca ve el token de sesión. Next lo guarda en una cookie `httpOnly` y lo reenvía a Django.
- Login en dos pasos: contraseña → código TOTP (o un código de respaldo). El token pendiente vive 5 minutos.
- Usuario sin 2FA: tras la contraseña va a `/admin/configurar-2fa` (QR generado en el servidor, código, códigos de
  respaldo). `exigirPanel()` no deja entrar a ninguna página del panel sin 2FA.
- `proxy.ts` solo revisa que exista la cookie. La validación real es `obtenerUsuario()` en `features/auth/server/dal.ts`.
- Cada página del panel se envuelve en `<Protegido modulo="...">`, que exige el permiso del módulo.

## Convenciones

- Colores: utilidades `catsa-*` (`bg-catsa-green`) o tokens de shadcn (`bg-primary`). Nada de hex sueltos.
- Puntos de corte: `movil:` (600px), `tablet:` (900px), `nav:` (1040px).
- Animación: `ease-catsa` para todo lo que se mueve.
- Nombres en español para el dominio (`listarNoticias`, `Protegido`). Los de librerías se quedan como vienen.

## Producción

```bash
docker build -t catsa-web .
docker run -p 3000:3000 --env-file .env catsa-web
```
