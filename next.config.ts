import type { NextConfig } from "next";

// Origen desde donde se sirven las imágenes subidas (Django en desarrollo,
// el almacenamiento de objetos en producción).
const MEDIA_URL = process.env.MEDIA_URL ?? "http://localhost:8000";

const cabecerasSeguridad = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  typedRoutes: true,
  // Imagen de Docker mínima: solo lo necesario para correr `node server.js`.
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    // La biblioteca acepta archivos de hasta 10 MB; el resto es margen del multipart.
    serverActions: { bodySizeLimit: "11mb" },
  },
  images: {
    remotePatterns: [
      new URL(`${MEDIA_URL}/**`),
      // Fotos del sitio actual de CATSA mientras llega la fotografía propia
      // (src/features/sitio/imagenes.ts).
      new URL("https://www.catsa.net/wp-content/uploads/**"),
    ],
    // En desarrollo las imágenes vienen de Django en localhost, que Next bloquea
    // por defecto (protección SSRF). En producción vienen de un dominio público.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
  async headers() {
    return [{ source: "/:path*", headers: cabecerasSeguridad }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
