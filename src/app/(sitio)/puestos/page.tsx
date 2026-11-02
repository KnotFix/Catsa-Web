import { Suspense } from "react";
import type { Metadata } from "next";
import { SeccionSitio } from "@/components/shared/seccion-sitio";
import { Skeleton } from "@/components/ui/skeleton";
import { ListaPuestos } from "@/features/puestos/components/lista-puestos";

export const metadata: Metadata = {
  title: "Trabaje con nosotros",
  description: "Puestos abiertos en CATSA.",
};

export default function PuestosPage() {
  return (
    <SeccionSitio antetitulo="Trabaje con nosotros" titulo="Puestos abiertos">
      <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
        <ListaPuestos />
      </Suspense>
    </SeccionSitio>
  );
}
