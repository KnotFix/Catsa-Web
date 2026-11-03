import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { descripcionModulos } from "@/config/modulos";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { exigirModulo } from "@/features/auth/server/dal";
import { PestanasAdministracion } from "@/features/usuarios/components/pestanas-administracion";
import { listarUsuarios } from "@/features/usuarios/server/api";
import { estadoCuenta } from "@/features/usuarios/types";
import { formatearFecha } from "@/lib/formato";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Usuarios" };

export default function UsuariosPanelPage({ searchParams }: PageProps<"/admin/usuarios">) {
  return (
    <>
      <EncabezadoPagina
        titulo="Administración"
        descripcion="Quién entra al panel y a qué módulos. Las cuentas se crean solo por invitación."
        acciones={
          <Button asChild>
            <Link href="/admin/usuarios/invitar">
              <UserPlus aria-hidden />
              Invitar
            </Link>
          </Button>
        }
      />
      <PestanasAdministracion activa="usuarios" />
      <Suspense fallback={<CargandoPagina />}>
        <Listado searchParams={searchParams} />
      </Suspense>
    </>
  );
}

const TONOS = {
  ok: "bg-catsa-sprout-bg text-catsa-green-d",
  aviso: "bg-catsa-amber-bg text-catsa-amber-ink",
  apagado: "bg-catsa-cream-2 text-catsa-muted",
};

async function Listado({ searchParams }: Pick<PageProps<"/admin/usuarios">, "searchParams">) {
  await exigirModulo("administracion");
  const { buscar } = await searchParams;
  const texto = typeof buscar === "string" ? buscar : undefined;
  const { results } = await listarUsuarios({ buscar: texto });

  return (
    <>
      <form action="/admin/usuarios" className="mb-6 w-full movil:w-72">
        <Input
          type="search"
          name="buscar"
          defaultValue={texto}
          placeholder="Buscar"
          aria-label="Buscar usuarios"
        />
      </form>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Persona</TableHead>
              <TableHead className="hidden nav:table-cell">Módulos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden tablet:table-cell">Último ingreso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((u) => {
              const estado = estadoCuenta(u);
              return (
                <TableRow key={u.id} className={cn(!u.activo && "opacity-60")}>
                  <TableCell>
                    <Link
                      href={`/admin/usuarios/${u.id}`}
                      className="font-semibold text-catsa-ink hover:text-catsa-green"
                    >
                      {u.nombre}
                    </Link>
                    <span className="block text-xs text-catsa-muted">
                      {u.email}
                      {u.departamento && ` · ${u.departamento}`}
                    </span>
                  </TableCell>
                  <TableCell className="hidden max-w-xs whitespace-normal nav:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {u.modulos.map((m) => (
                        <Badge key={m} variant="secondary">
                          {descripcionModulos[m].titulo}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", TONOS[estado.tono])}
                    >
                      {estado.texto}
                    </span>
                  </TableCell>
                  <TableCell className="hidden tablet:table-cell">
                    {u.ultimo_ingreso ? formatearFecha(u.ultimo_ingreso) : "Nunca"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
