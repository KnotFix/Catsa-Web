import { Suspense } from "react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { EstadoVacio } from "@/components/shared/estado-vacio";
import { leerPagina, Paginacion } from "@/components/shared/paginacion";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { exigirModulo } from "@/features/auth/server/dal";
import { PestanasAdministracion } from "@/features/usuarios/components/pestanas-administracion";
import { listarAccesos } from "@/features/usuarios/server/api";
import { eventosAcceso, type EventoAcceso } from "@/features/usuarios/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Registro de accesos" };

const hora = new Intl.DateTimeFormat("es-CR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Costa_Rica",
});

export default function AccesosPage({ searchParams }: PageProps<"/admin/usuarios/accesos">) {
  return (
    <>
      <EncabezadoPagina
        titulo="Administración"
        descripcion="Cada inicio y cierre de sesión, y cada intento fallido. No se puede editar ni borrar."
      />
      <PestanasAdministracion activa="accesos" />
      <Suspense fallback={<CargandoPagina />}>
        <Registro searchParams={searchParams} />
      </Suspense>
    </>
  );
}

const EVENTOS = Object.keys(eventosAcceso) as EventoAcceso[];

async function Registro({ searchParams }: Pick<PageProps<"/admin/usuarios/accesos">, "searchParams">) {
  await exigirModulo("administracion");
  const consulta = await searchParams;
  const evento = EVENTOS.find((e) => e === consulta.evento);
  const buscar = typeof consulta.buscar === "string" ? consulta.buscar : undefined;
  const pagina = leerPagina(consulta.pagina);
  const { count, results } = await listarAccesos({ evento, buscar, pagina });

  const enlace = (cambios: Record<string, string | undefined>): Route => {
    const p = new URLSearchParams(
      Object.entries({ evento, buscar, ...cambios }).filter((par): par is [string, string] =>
        Boolean(par[1]),
      ),
    );
    return `/admin/usuarios/accesos${p.size ? `?${p}` : ""}` as Route;
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Tipo de evento" className="flex gap-1 rounded-lg bg-card p-1">
          {[undefined, ...EVENTOS].map((e) => (
            <Link
              key={e ?? "todos"}
              href={enlace({ evento: e, pagina: undefined })}
              aria-current={evento === e ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-semibold",
                evento === e ? "bg-catsa-ink text-white" : "text-catsa-body hover:bg-catsa-cream",
              )}
            >
              {e ? eventosAcceso[e] : "Todos"}
            </Link>
          ))}
        </nav>
        <form action="/admin/usuarios/accesos" className="w-full movil:w-72">
          {evento && <input type="hidden" name="evento" value={evento} />}
          <Input
            type="search"
            name="buscar"
            defaultValue={buscar}
            placeholder="Correo o IP"
            aria-label="Buscar por correo o IP"
          />
        </form>
      </div>

      {results.length === 0 ? (
        <EstadoVacio titulo="No hay registros con ese filtro" />
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Persona</TableHead>
                <TableHead className="hidden tablet:table-cell">IP</TableHead>
                <TableHead className="hidden nav:table-cell">Navegador</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="whitespace-nowrap">{hora.format(new Date(a.fecha))}</TableCell>
                  <TableCell>
                    <span className={cn(a.evento === "fallido" && "font-semibold text-catsa-danger")}>
                      {eventosAcceso[a.evento]}
                    </span>
                  </TableCell>
                  <TableCell>
                    {a.nombre ?? a.email}
                    {a.nombre && <span className="block text-xs text-catsa-muted">{a.email}</span>}
                  </TableCell>
                  <TableCell className="hidden font-mono text-xs tablet:table-cell">{a.ip ?? "—"}</TableCell>
                  <TableCell
                    className="hidden max-w-xs truncate text-xs text-catsa-muted nav:table-cell"
                    title={a.agente}
                  >
                    {a.agente || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Paginacion
        total={count}
        pagina={pagina}
        porPagina={50}
        enlace={(p) => enlace({ pagina: p > 1 ? String(p) : undefined })}
      />
    </>
  );
}
