import { Suspense } from "react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { Plus, Tags } from "lucide-react";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { EstadoVacio } from "@/components/shared/estado-vacio";
import { leerPagina, Paginacion } from "@/components/shared/paginacion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { exigirModulo } from "@/features/auth/server/dal";
import { listarNoticiasPanel } from "@/features/noticias/server/panel";
import { estadosNoticia, type EstadoNoticia } from "@/features/noticias/types";
import { formatearFecha } from "@/lib/formato";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Noticias" };

export default function NoticiasPanelPage({ searchParams }: PageProps<"/admin/noticias">) {
  return (
    <>
      <EncabezadoPagina
        titulo="Noticias"
        descripcion="Cree, edite y publique las noticias del sitio."
        acciones={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/noticias/categorias">
                <Tags aria-hidden />
                Categorías
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/noticias/nueva">
                <Plus aria-hidden />
                Nueva noticia
              </Link>
            </Button>
          </div>
        }
      />
      <Suspense fallback={<CargandoPagina />}>
        <Listado searchParams={searchParams} />
      </Suspense>
    </>
  );
}

const ESTADOS = Object.keys(estadosNoticia) as EstadoNoticia[];

async function Listado({ searchParams }: Pick<PageProps<"/admin/noticias">, "searchParams">) {
  await exigirModulo("noticias");
  const consulta = await searchParams;
  const estado = ESTADOS.find((e) => e === consulta.estado);
  const buscar = typeof consulta.buscar === "string" ? consulta.buscar : undefined;
  const pagina = leerPagina(consulta.pagina);
  const { count, results } = await listarNoticiasPanel({ estado, buscar, pagina });

  const enlace = (cambios: Record<string, string | undefined>): Route => {
    const p = new URLSearchParams(
      Object.entries({ estado, buscar, ...cambios }).filter((par): par is [string, string] =>
        Boolean(par[1]),
      ),
    );
    return `/admin/noticias${p.size ? `?${p}` : ""}` as Route;
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Estado" className="flex gap-1 rounded-lg bg-card p-1">
          {[undefined, ...ESTADOS].map((e) => (
            <Link
              key={e ?? "todas"}
              href={enlace({ estado: e, pagina: undefined })}
              aria-current={estado === e ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-semibold",
                estado === e ? "bg-catsa-ink text-white" : "text-catsa-body hover:bg-catsa-cream",
              )}
            >
              {e ? `${estadosNoticia[e]}s` : "Todas"}
            </Link>
          ))}
        </nav>
        <form action="/admin/noticias" className="w-full movil:w-72">
          {estado && <input type="hidden" name="estado" value={estado} />}
          <Input
            type="search"
            name="buscar"
            defaultValue={buscar}
            placeholder="Buscar"
            aria-label="Buscar noticias"
          />
        </form>
      </div>

      {results.length === 0 ? (
        <EstadoVacio
          titulo={estado || buscar ? "No hay noticias con ese filtro" : "Todavía no hay noticias"}
          descripcion={estado || buscar ? undefined : "Cree la primera con «Nueva noticia»."}
        />
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead className="hidden tablet:table-cell">Categoría</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden tablet:table-cell">Publicada</TableHead>
                <TableHead className="hidden nav:table-cell">Última edición</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="max-w-md">
                    <Link
                      href={`/admin/noticias/${n.id}`}
                      className="font-semibold text-catsa-ink hover:text-catsa-green"
                    >
                      {n.titulo}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden tablet:table-cell">{n.categoria?.nombre ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={n.estado === "publicada" ? "default" : "secondary"}>
                      {estadosNoticia[n.estado]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden tablet:table-cell">
                    {n.publicada_en ? formatearFecha(n.publicada_en) : "—"}
                  </TableCell>
                  <TableCell className="hidden nav:table-cell">{formatearFecha(n.actualizado_en)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Paginacion
        total={count}
        pagina={pagina}
        enlace={(p) => enlace({ pagina: p > 1 ? String(p) : undefined })}
      />
    </>
  );
}
