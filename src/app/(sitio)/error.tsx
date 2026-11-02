"use client";

import { Contenedor } from "@/components/shared/contenedor";
import { Button } from "@/components/ui/button";

export default function ErrorSitio({ reset }: { error: Error; reset: () => void }) {
  return (
    <Contenedor className="py-24 text-center">
      <h1 className="text-3xl text-catsa-ink">Algo salió mal</h1>
      <p className="mt-3 text-catsa-body">No pudimos cargar esta página. Intente de nuevo en un momento.</p>
      <Button className="mt-8" onClick={reset}>
        Reintentar
      </Button>
    </Contenedor>
  );
}
