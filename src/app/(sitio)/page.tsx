import { Suspense } from "react";
import Link from "next/link";
import { Contenedor } from "@/components/shared/contenedor";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { obtenerEspacio } from "@/features/contenido/api";
import { espacioInicioHero } from "@/features/contenido/espacios";
import { CargandoNoticias, ListaNoticias } from "@/features/noticias/components/lista-noticias";

// Cada bloque con datos va en su Suspense. Con la API arriba, las lecturas están
// en caché y todo sale en el HTML estático; si la API falla, solo ese bloque
// espera y el resto de la página carga igual.
export default function InicioPage() {
  return (
    <>
      <section className="bg-catsa-cream">
        <Contenedor className="py-24 tablet:py-32">
          <Suspense fallback={<CargandoHero />}>
            <Hero />
          </Suspense>
          <div className="mt-8 flex gap-3">
            <Button asChild size="lg">
              <Link href="/noticias">Ver noticias</Link>
            </Button>
          </div>
        </Contenedor>
      </section>
      <section className="py-16 tablet:py-24">
        <Contenedor>
          <h2 className="mb-8 text-3xl text-catsa-ink">Últimas noticias</h2>
          <Suspense fallback={<CargandoNoticias />}>
            <ListaNoticias limite={3} />
          </Suspense>
        </Contenedor>
      </section>
    </>
  );
}

async function Hero() {
  const hero = await obtenerEspacio(espacioInicioHero);
  return (
    <>
      <p className="text-xs font-semibold tracking-[0.16em] text-catsa-green uppercase">{hero.antetitulo}</p>
      <h1 className="mt-4 max-w-2xl text-4xl text-catsa-ink tablet:text-5xl">{hero.titulo}</h1>
      <p className="mt-5 max-w-xl text-lg text-catsa-body">{hero.texto}</p>
    </>
  );
}

function CargandoHero() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-3 w-48" />
      <Skeleton className="h-12 w-full max-w-xl" />
      <Skeleton className="h-16 w-full max-w-lg" />
    </div>
  );
}
