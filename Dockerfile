# Imagen de producción de Catsa-Web (Next.js standalone).
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Se leen al construir, no al correr: next.config.ts arma con MEDIA_URL las imágenes
# permitidas, y el sitemap y los metadatos salen con SITE_URL. En Dokploy van en
# "Build-time arguments", además de en las variables de entorno.
ARG MEDIA_URL=http://localhost:8000
ARG SITE_URL=http://localhost:3000
# Solo producción: true deja que los buscadores indexen el sitio.
ARG INDEXAR=false
ENV MEDIA_URL=$MEDIA_URL SITE_URL=$SITE_URL INDEXAR=$INDEXAR NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
CMD ["node", "server.js"]
