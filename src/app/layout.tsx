import type { Metadata } from "next";
import { Poppins, Source_Sans_3 } from "next/font/google";
import { sitio } from "@/config/sitio";
import { env } from "@/lib/env";
import "./globals.css";

// Tipografía de la bitácora: Poppins para títulos, Source Sans 3 para texto.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.SITE_URL),
  title: {
    default: `${sitio.nombre} · ${sitio.nombreLegal}`,
    template: `%s · ${sitio.nombre}`,
  },
  description: sitio.descripcion,
  openGraph: { siteName: sitio.nombre, locale: "es_CR", type: "website" },
  // Fuera de producción, además de robots.txt, cada página pide no ser indexada.
  robots: env.INDEXAR ? undefined : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CR" className={`${poppins.variable} ${sourceSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
