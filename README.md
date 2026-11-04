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

| Script              | Para qué                                                                    |
| ------------------- | --------------------------------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo                                                      |
| `npm run build`     | Build de producción (salida `standalone` para Docker)                       |
| `npm run lint`      | ESLint                                                                      |
| `npm run typecheck` | Tipos de rutas + `tsc`                                                      |
| `npm run format`    | Prettier (ordena también las clases de Tailwind)                            |
| `npm run api:tipos` | Genera `src/types/api.d.ts` desde el OpenAPI de Django (corriendo en :8000) |

## Arquitectura

```
src/
  app/                    Solo rutas: páginas delgadas que componen features.
    (sitio)/              Sitio público. El grupo no aparece en la URL. sitio.css + estilos.css por página.
    admin/(acceso)/       Login y verificación 2FA (sin barra lateral).
    admin/(panel)/        Panel. Una carpeta por módulo de permisos.
    api/revalidar/        Webhook que llama Django al publicar.
  features/               Un dominio por carpeta. Aquí vive la lógica.
    auth/                 Sesión, 2FA, permisos por módulo.
      server/             Solo servidor: cookies, cliente allauth, DAL.
      components/         Formularios de acceso, <Protegido>.
      actions.ts          Server Actions (login, código, salir).
    noticias/  puestos/   api.ts (lecturas públicas en caché), server/panel.ts (lecturas del panel),
                          actions.ts (escrituras), types.ts, components/ y components/panel/
    medios/               Biblioteca: galería, subida y <SelectorMedio> para los formularios.
    contenido/            Espacios editables (esquema zod y texto por defecto) y ajustes del sitio.
    sitio/                Contenido fijo del sitio: fotos, catálogo de productos, piezas interactivas.
  components/
    ui/                   shadcn. Se agregan con `npx shadcn@latest add`.
    layout/sitio|panel/   Encabezado, pie, barra lateral.
    sitio/                Piezas del boceto: encabezado de página, titular por palabras, cierre, movimiento.
    shared/               Piezas reutilizables sin dominio.
  config/                 Navegación del sitio y módulos del panel.
  types/api.d.ts          Tipos generados del OpenAPI de Catsa-Api. Se versiona; no se edita a mano.
  lib/
    api/                  Único cliente HTTP hacia Django, errores, etiquetas de caché.
    env.ts                Variables de entorno validadas (solo servidor).
  proxy.ts                Redirige /admin sin cookie (revisión optimista).
```

### Reglas

1. **`app/` no tiene lógica.** Una página importa de `features/*` y arma la vista.
2. **Toda llamada a Django pasa por `lib/api/http.ts`.** Nada de `fetch` sueltos.
3. **Lo que es solo servidor importa `server-only`.** Tokens, cookies y `env` nunca llegan al navegador.
4. **Una feature no importa de otra**, salvo `auth` (sesión y cliente del panel) y `medios` (el selector de archivos
   lo usan todos los formularios). Lo compartido va a `components/shared` o `lib`.
5. **Datos con `Suspense`.** Cada bloque que lee datos va en su `<Suspense>` con esqueleto. Así la página sale estática y solo el bloque que falla espera.

### Sitio público: diseño

El sitio sigue el boceto aprobado (`demo-catsa-live`, dirección "Institucional Sólida"). Su CSS se portó tal cual,
no en Tailwind, para no perder detalle:

- `app/(sitio)/sitio.css`: lo compartido (barra, encabezado `.ph`, costura, cierre `.cta-final`, pie, botones).
  Las variables del boceto se renombraron a `--catsa-*`: `--muted` de shadcn es otra cosa.
- `estilos.css` junto a cada página, anidado bajo una clase raíz (`.pg-sobre`, `.pg-areas`…) para que nombres
  como `.grid` o `.card` no choquen entre páginas.
- El movimiento lo pone `<Movimiento>` (`components/sitio`). Lo que entra al hacer scroll solo se esconde con
  `@media (scripting: enabled)`: sin JavaScript o con movimiento reducido, todo se ve. Los titulares por palabra
  se parten en el servidor (`<Titular>`), no en el navegador.
- Las fotos viven en `public/sitio/` (WebP) y se registran en `features/sitio/imagenes.ts`. Son las de catsa.net,
  copiadas en su mayor resolución; las de RSE y algunas de áreas son pequeñas (550 px). Cuando CATSA entregue
  fotografía propia se cambian ahí.
- Catálogo, certificaciones, áreas y RSE son contenido fijo (alcance): se cambian en código. Los datos salen de
  catsa.net. El catálogo (`features/sitio/productos.ts`) genera una ficha por producto en `/productos/[slug]`.

### Datos y caché

- Las lecturas públicas (`features/*/api.ts`) usan `"use cache"` + `cacheTag`. Se quedan en caché hasta que
  Django llama a `POST /api/revalidar` con las etiquetas de `lib/api/etiquetas.ts`.
- Si la API no responde, `conRespaldo` devuelve un valor vacío de vida corta: la página no se rompe y se
  vuelve a intentar en segundos.
- Los espacios editables se validan con zod. Si el dato no calza, se usa el texto por defecto del diseño.
- Contacto, horario, redes e imagen para compartir salen de los ajustes del sitio (`features/contenido/ajustes.ts`):
  el pie los muestra y lo vacío no aparece. Cada página arma su `openGraph` con `openGraphSitio()`, porque Next
  reemplaza el `openGraph` del layout entero y se perdería la imagen por defecto.
- Los tipos de las respuestas salen de `src/types/api.d.ts`. Si cambia un serializer en Django, se corre
  `npm run api:tipos` y `npm run typecheck` señala lo que hay que ajustar.
- Puestos tiene caché de minutos y no de horas: uno sale solo del listado al vencer su fecha de cierre, sin aviso.

### Acceso al panel (BFF)

```
Navegador ──(cookie httpOnly)──▶ Next (Server Actions / RSC) ──(X-Session-Token)──▶ Django allauth
```

- El navegador nunca ve el token de sesión. Next lo guarda en una cookie `httpOnly` y lo reenvía a Django.
- Login en dos pasos: contraseña → código TOTP (o un código de respaldo). El token pendiente vive 5 minutos.
- Usuario sin 2FA: tras la contraseña va a `/admin/configurar-2fa` (QR generado en el servidor, código, códigos de
  respaldo). `exigirPanel()` no deja entrar a ninguna página del panel sin 2FA.
- `proxy.ts` solo revisa que exista la cookie. La validación real es `obtenerUsuario()` en `features/auth/server/dal.ts`.
- Invitación y "¿Olvidó su contraseña?" llegan a `/admin/restablecer/<clave>` (allauth, un solo uso).
- Las llamadas a allauth llevan la IP y el navegador del visitante (`X-Forwarded-For`, `User-Agent`): sin eso,
  Django vería siempre a Next en el registro de accesos y en el bloqueo por intentos fallidos.
- Cada página del panel se envuelve en `<Protegido modulo="...">`, que exige el permiso del módulo.

### Panel

- Cada lectura del panel pasa por `apiPanel()` (`features/auth/server/panel.ts`): lleva el token de la sesión, sin
  sesión vuelve al login y sin permiso al inicio. Nunca va dentro de `"use cache"`.
- Las Server Actions devuelven un `Resultado` (`lib/api/resultado.ts`) con el error de cada campo tal como lo nombra
  Django. `intentar()` hace esa conversión; después de escribir, `refresh()` actualiza la página.
- Django es quien valida y decide permisos. Tras publicar, él avisa a `/api/revalidar` y la etiqueta vence en el
  acto (`{ expire: 0 }`): quien publica ve el cambio en la primera visita al sitio.
- Las noticias en borrador se guardan solas mientras se escribe. Lo publicado se guarda a mano, porque cada guardado
  cambia el sitio.
- Texto con formato: `<EditorTexto>` (Tiptap) solo ofrece lo que Django deja pasar en `apps/core/html.py`.

## Convenciones

- Colores: utilidades `catsa-*` (`bg-catsa-green`) o tokens de shadcn (`bg-primary`). Nada de hex sueltos.
- Puntos de corte: `movil:` (600px), `tablet:` (900px), `nav:` (1040px).
- Animación: `ease-catsa` para todo lo que se mueve.
- Nombres en español para el dominio (`listarNoticias`, `Protegido`). Los de librerías se quedan como vienen.

## Producción

```bash
docker build -t catsa-web --build-arg SITE_URL=https://... --build-arg MEDIA_URL=https://... .
docker run -p 3000:3000 --env-file .env catsa-web
```

`SITE_URL`, `MEDIA_URL` e `INDEXAR` se leen al construir (imágenes permitidas, sitemap, robots), así que van como
argumentos de build además de variables de entorno. `INDEXAR=true` solo en producción. Se despliega en Dokploy:
pasos en `docs/despliegue-dokploy.md` de Catsa-Api.
