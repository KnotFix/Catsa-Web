import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { exigirModulo } from "@/features/auth/server/dal";
import { listarEspacios } from "@/features/contenido/server/panel";
import type { EspacioPanel } from "@/features/contenido/types";
import { formatearFecha } from "@/lib/formato";

export const metadata: Metadata = { title: "Contenido del sitio" };

export default function ContenidoPanelPage() {
  return (
    <>
      <EncabezadoPagina
        titulo="Contenido del sitio"
        descripcion="Cambie textos e imágenes de las páginas sin tocar el diseño."
      />
      <Suspense fallback={<CargandoPagina />}>
        <Espacios />
      </Suspense>
    </>
  );
}

async function Espacios() {
  await exigirModulo("contenido");
  const espacios = await listarEspacios();
  const porPagina = Map.groupBy(espacios, (e) => e.pagina);

  return (
    <div className="grid max-w-3xl gap-8">
      {[...porPagina].map(([pagina, lista]) => (
        <section key={pagina}>
          <h2 className="mb-3 text-lg text-catsa-ink">{pagina}</h2>
          <ul className="divide-y rounded-xl border bg-card">
            {lista.map((espacio) => (
              <li key={espacio.clave}>
                <Link
                  href={`/admin/contenido/${espacio.clave}`}
                  className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-catsa-cream"
                >
                  <div>
                    <p className="font-semibold text-catsa-ink">{espacio.nombre}</p>
                    <p className="text-sm text-catsa-muted">{ultimaEdicion(espacio)}</p>
                  </div>
                  <ChevronRight className="size-4 text-catsa-muted" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function ultimaEdicion(espacio: EspacioPanel) {
  if (!espacio.actualizado_en) return "Con el texto del diseño original";
  const quien = espacio.actualizado_por ? ` por ${espacio.actualizado_por}` : "";
  return `Editado el ${formatearFecha(espacio.actualizado_en)}${quien}`;
}
