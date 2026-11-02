import { Suspense } from "react";
import type { Metadata } from "next";
import { SeccionSitio } from "@/components/shared/seccion-sitio";
import { CargandoNoticias, ListaNoticias } from "@/features/noticias/components/lista-noticias";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Noticias y comunicados de CATSA.",
};

export default function NoticiasPage() {
  return (
    <SeccionSitio antetitulo="Sala de prensa" titulo="Noticias">
      <Suspense fallback={<CargandoNoticias />}>
        <ListaNoticias />
      </Suspense>
    </SeccionSitio>
  );
}
