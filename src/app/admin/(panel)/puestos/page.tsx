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
import { listarPuestosPanel } from "@/features/puestos/server/panel";
import { estadosPuesto, type EstadoPuesto } from "@/features/puestos/types";
import { formatearFecha } from "@/lib/formato";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Puestos" };

export default function PuestosPanelPage({ searchParams }: PageProps<"/admin/puestos">) {
  return (
    <>
      <EncabezadoPagina
        titulo="Puestos"
        descripcion="Publique, edite y cierre las vacantes de Trabaje con nosotros."
        acciones={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/puestos/areas">
                <Tags aria-hidden />
                Áreas
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/puestos/nuevo">
                <Plus aria-hidden />
                Nuevo puesto
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

const ESTADOS = Object.keys(estadosPuesto) as EstadoPuesto[];

async function Listado({ searchParams }: Pick<PageProps<"/admin/puestos">, "searchParams">) {
  await exigirModulo("puestos");
  const consulta = await searchParams;
  const estado = ESTADOS.find((e) => e === consulta.estado);
  const buscar = typeof consulta.buscar === "string" ? consulta.buscar : undefined;
  const pagina = leerPagina(consulta.pagina);
  const { count, results } = await listarPuestosPanel({ estado, buscar, pagina });

  const enlace = (cambios: Record<string, string | undefined>): Route => {
    const p = new URLSearchParams(
      Object.entries({ estado, buscar, ...cambios }).filter((par): par is [string, string] =>
        Boolean(par[1]),
      ),
    );
    return `/admin/puestos${p.size ? `?${p}` : ""}` as Route;
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Estado" className="flex gap-1 rounded-lg bg-card p-1">
          {[undefined, ...ESTADOS].map((e) => (
            <Link
              key={e ?? "todos"}
              href={enlace({ estado: e, pagina: undefined })}
              aria-current={estado === e ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-semibold",
                estado === e ? "bg-catsa-ink text-white" : "text-catsa-body hover:bg-catsa-cream",
              )}
            >
              {e ? `${estadosPuesto[e]}s` : "Todos"}
            </Link>
          ))}
        </nav>
        <form action="/admin/puestos" className="w-full movil:w-72">
          {estado && <input type="hidden" name="estado" value={estado} />}
          <Input
            type="search"
            name="buscar"
            defaultValue={buscar}
            placeholder="Buscar"
            aria-label="Buscar puestos"
          />
        </form>
      </div>

      {results.length === 0 ? (
        <EstadoVacio
          titulo={estado || buscar ? "No hay puestos con ese filtro" : "Todavía no hay puestos"}
          descripcion={estado || buscar ? undefined : "Cree el primero con «Nuevo puesto»."}
        />
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Puesto</TableHead>
                <TableHead className="hidden tablet:table-cell">Área</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden tablet:table-cell">Cierra</TableHead>
                <TableHead className="hidden nav:table-cell">Última edición</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="max-w-md">
                    <Link
                      href={`/admin/puestos/${p.id}`}
                      className="font-semibold text-catsa-ink hover:text-catsa-green"
                    >
                      {p.titulo}
                    </Link>
                    <span className="block text-xs text-catsa-muted">{p.ubicacion}</span>
                  </TableCell>
                  <TableCell className="hidden tablet:table-cell">{p.area.nombre}</TableCell>
                  <TableCell>
                    <Badge variant={p.recibe_postulaciones ? "default" : "secondary"}>
                      {p.estado === "abierto" && !p.recibe_postulaciones
                        ? "Vencido"
                        : estadosPuesto[p.estado]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden tablet:table-cell">
                    {p.cierra_el ? formatearFecha(p.cierra_el) : "—"}
                  </TableCell>
                  <TableCell className="hidden nav:table-cell">{formatearFecha(p.actualizado_en)}</TableCell>
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
