import { Suspense } from "react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { EstadoVacio } from "@/components/shared/estado-vacio";
import { leerPagina, Paginacion } from "@/components/shared/paginacion";
import { Input } from "@/components/ui/input";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { exigirModulo } from "@/features/auth/server/dal";
import { BotonSubir } from "@/features/medios/components/boton-subir";
import { GaleriaMedios } from "@/features/medios/components/galeria-medios";
import { listarMedios } from "@/features/medios/server/api";
import type { TipoMedio } from "@/features/medios/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Biblioteca de medios" };

export default function MediosPanelPage({ searchParams }: PageProps<"/admin/medios">) {
  return (
    <Suspense fallback={<CargandoPagina />}>
      <Biblioteca searchParams={searchParams} />
    </Suspense>
  );
}

const TIPOS: { valor?: TipoMedio; titulo: string }[] = [
  { titulo: "Todos" },
  { valor: "imagen", titulo: "Imágenes" },
  { valor: "pdf", titulo: "PDF" },
];

async function Biblioteca({ searchParams }: Pick<PageProps<"/admin/medios">, "searchParams">) {
  const usuario = await exigirModulo("medios");
  const consulta = await searchParams;
  const tipo = TIPOS.find((t) => t.valor && t.valor === consulta.tipo)?.valor;
  const buscar = typeof consulta.buscar === "string" ? consulta.buscar : undefined;
  const pagina = leerPagina(consulta.pagina);
  const { count, results } = await listarMedios({ tipo, buscar, pagina });

  const enlace = (cambios: Record<string, string | undefined>) => {
    const p = new URLSearchParams(
      Object.entries({ tipo, buscar, ...cambios }).filter((par): par is [string, string] => Boolean(par[1])),
    );
    return `/admin/medios${p.size ? `?${p}` : ""}` as Route;
  };

  return (
    <>
      <EncabezadoPagina
        titulo="Biblioteca de medios"
        descripcion="Imágenes y documentos que se usan en el sitio."
        acciones={<BotonSubir />}
      />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Tipo de archivo" className="flex gap-1 rounded-lg bg-card p-1">
          {TIPOS.map((t) => (
            <Link
              key={t.titulo}
              href={enlace({ tipo: t.valor, pagina: undefined })}
              aria-current={tipo === t.valor ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-semibold",
                tipo === t.valor ? "bg-catsa-ink text-white" : "text-catsa-body hover:bg-catsa-cream",
              )}
            >
              {t.titulo}
            </Link>
          ))}
        </nav>
        <form action="/admin/medios" className="w-full movil:w-72">
          {tipo && <input type="hidden" name="tipo" value={tipo} />}
          <Input
            type="search"
            name="buscar"
            defaultValue={buscar}
            placeholder="Buscar"
            aria-label="Buscar archivos"
          />
        </form>
      </div>

      {results.length === 0 ? (
        <EstadoVacio
          titulo={buscar || tipo ? "No hay archivos con ese filtro" : "La biblioteca está vacía"}
          descripcion={buscar || tipo ? undefined : "Suba la primera imagen o PDF con el botón de arriba."}
        />
      ) : (
        <GaleriaMedios
          medios={results}
          puedeEditar
          puedeEliminar={usuario.modulos.includes("administracion")}
        />
      )}
      <Paginacion
        total={count}
        pagina={pagina}
        porPagina={24}
        enlace={(p) => enlace({ pagina: p > 1 ? String(p) : undefined })}
      />
    </>
  );
}
