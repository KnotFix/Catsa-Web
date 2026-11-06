import { Suspense } from "react";
import type { Metadata } from "next";
import { CabeceraPagina } from "@/components/sitio/cabecera-pagina";
import { ConEspacio } from "@/features/contenido/components/con-espacio";
import { espacioPuestosEncabezado } from "@/features/contenido/espacios";
import { Skeleton } from "@/components/ui/skeleton";
import { FiltrosPuestos } from "@/features/puestos/components/filtros-puestos";
import { ListaPuestos } from "@/features/puestos/components/lista-puestos";

export const metadata: Metadata = {
  title: "Trabaje con nosotros",
  description: "Puestos abiertos en CATSA y los beneficios de trabajar con nosotros en Guanacaste.",
};

// Los que publica Recursos Humanos en catsa.net (Nuestro Departamento).
const BENEFICIOS = [
  { titulo: "Transporte", texto: "Servicio de transporte para nuestros colaboradores." },
  { titulo: "Comedor subvencionado", texto: "Alimentación a precio subvencionado en la empresa." },
  { titulo: "Médico de empresa", texto: "Atención médica en las instalaciones de CATSA." },
  { titulo: "ASECATSA", texto: "Nuestra Asociación Solidarista de colaboradores." },
];

export default function PuestosPage({ searchParams }: PageProps<"/puestos">) {
  return (
    <>
      <ConEspacio espacio={espacioPuestosEncabezado}>
        {(datos) => (
          <CabeceraPagina
            {...datos}
            icono={
              <>
                <path pathLength={1} d="M4 7h16v13H4z" />
                <path pathLength={1} d="M9 7V4h6v3" />
              </>
            }
          />
        )}
      </ConEspacio>
      <section className="pb-24">
        <div className="wrap">
          <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
            <Listado searchParams={searchParams} />
          </Suspense>

          <section className="mt-20" aria-labelledby="beneficios">
            <h2 id="beneficios" className="font-heading text-2xl font-semibold text-catsa-green">
              Beneficios de trabajar en CATSA
            </h2>
            <p className="mt-2 max-w-[60ch] text-catsa-muted">
              Somos una empresa comprometida con el bienestar de quienes trabajan con nosotros. Estos
              beneficios son parte de lo que ofrecemos.
            </p>
            <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {BENEFICIOS.map((b) => (
                <li
                  key={b.titulo}
                  className="rounded-2xl border border-catsa-line bg-catsa-paper p-6"
                  data-reveal
                >
                  <h3 className="font-heading text-lg font-semibold text-catsa-ink">{b.titulo}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-catsa-muted">{b.texto}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </>
  );
}

async function Listado({ searchParams }: Pick<PageProps<"/puestos">, "searchParams">) {
  const { area, ubicacion } = await searchParams;
  const elegidos = {
    area: typeof area === "string" ? area : undefined,
    ubicacion: typeof ubicacion === "string" ? ubicacion : undefined,
  };
  return (
    <>
      <FiltrosPuestos elegidos={elegidos} />
      <ListaPuestos filtros={elegidos} />
    </>
  );
}
