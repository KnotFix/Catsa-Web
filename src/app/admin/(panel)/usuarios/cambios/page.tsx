import { Suspense } from "react";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { EstadoVacio } from "@/components/shared/estado-vacio";
import { leerPagina, Paginacion } from "@/components/shared/paginacion";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { descripcionModulos, MODULOS } from "@/config/modulos";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { exigirModulo } from "@/features/auth/server/dal";
import { PestanasAdministracion } from "@/features/usuarios/components/pestanas-administracion";
import { listarCambios } from "@/features/usuarios/server/api";
import type { Cambio } from "@/features/usuarios/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Historial de cambios" };

const hora = new Intl.DateTimeFormat("es-CR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Costa_Rica",
});

export default function CambiosPage({ searchParams }: PageProps<"/admin/usuarios/cambios">) {
  return (
    <>
      <EncabezadoPagina
        titulo="Administración"
        descripcion="Quién publicó, editó o borró qué en el panel. No se puede editar ni borrar."
      />
      <PestanasAdministracion activa="cambios" />
      <Suspense fallback={<CargandoPagina />}>
        <Historial searchParams={searchParams} />
      </Suspense>
    </>
  );
}

/** Dónde se ve hoy el elemento. Lo eliminado no tiene enlace. */
function enlaceDe(c: Cambio): Route | null {
  if (c.accion === "eliminar") return null;
  if (c.tipo === "ajustes del sitio") return "/admin/usuarios/ajustes";
  if (c.objeto_id === null) return null;
  const rutas: Record<string, string> = {
    noticia: `/admin/noticias/${c.objeto_id}`,
    puesto: `/admin/puestos/${c.objeto_id}`,
    usuario: `/admin/usuarios/${c.objeto_id}`,
    categoría: "/admin/noticias/categorias",
    área: "/admin/puestos/areas",
    archivo: "/admin/medios",
  };
  return (rutas[c.tipo] as Route | undefined) ?? null;
}

async function Historial({ searchParams }: Pick<PageProps<"/admin/usuarios/cambios">, "searchParams">) {
  await exigirModulo("administracion");
  const consulta = await searchParams;
  const modulo = MODULOS.find((m) => m === consulta.modulo);
  const buscar = typeof consulta.buscar === "string" ? consulta.buscar : undefined;
  const pagina = leerPagina(consulta.pagina);
  const { count, results } = await listarCambios({ modulo, buscar, pagina });

  const enlace = (cambios: Record<string, string | undefined>): Route => {
    const p = new URLSearchParams(
      Object.entries({ modulo, buscar, ...cambios }).filter((par): par is [string, string] =>
        Boolean(par[1]),
      ),
    );
    return `/admin/usuarios/cambios${p.size ? `?${p}` : ""}` as Route;
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Módulo" className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-card p-1">
          {[undefined, ...MODULOS].map((m) => (
            <Link
              key={m ?? "todos"}
              href={enlace({ modulo: m, pagina: undefined })}
              aria-current={modulo === m ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-sm font-semibold",
                modulo === m ? "bg-catsa-ink text-white" : "text-catsa-body hover:bg-catsa-cream",
              )}
            >
              {m ? descripcionModulos[m].titulo : "Todos"}
            </Link>
          ))}
        </nav>
        <form action="/admin/usuarios/cambios" className="w-full movil:w-72">
          {modulo && <input type="hidden" name="modulo" value={modulo} />}
          <Input
            type="search"
            name="buscar"
            defaultValue={buscar}
            placeholder="Persona o elemento"
            aria-label="Buscar por persona o elemento"
          />
        </form>
      </div>

      {results.length === 0 ? (
        <EstadoVacio titulo={modulo || buscar ? "No hay cambios con ese filtro" : "Todavía no hay cambios"} />
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Persona</TableHead>
                <TableHead>Qué hizo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((c) => {
                const href = enlaceDe(c);
                return (
                  <TableRow key={c.id}>
                    <TableCell className="align-top whitespace-nowrap">
                      {hora.format(new Date(c.fecha))}
                    </TableCell>
                    <TableCell className="align-top">{c.nombre_usuario || "Sistema"}</TableCell>
                    <TableCell className="whitespace-normal">
                      <span className={cn(c.accion === "eliminar" && "font-semibold text-catsa-danger")}>
                        {c.accion_texto}
                      </span>{" "}
                      {/* "Editó Ajustes del sitio", no "Editó ajustes del sitio Ajustes del sitio". */}
                      {c.tipo.toLowerCase() !== c.elemento.toLowerCase() && `${c.tipo} `}
                      {href ? (
                        <Link href={href} className="font-semibold text-catsa-ink hover:text-catsa-green">
                          {c.elemento}
                        </Link>
                      ) : (
                        <span className="font-semibold text-catsa-ink">{c.elemento}</span>
                      )}
                      {c.detalle && <span className="block text-xs text-catsa-muted">{c.detalle}</span>}
                    </TableCell>
                  </TableRow>
                );
              })}
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
