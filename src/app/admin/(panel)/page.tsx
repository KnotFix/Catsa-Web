import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { Skeleton } from "@/components/ui/skeleton";
import { accesosPanel, descripcionModulos, navegacionPanel } from "@/config/modulos";
import { exigirPanel } from "@/features/auth/server/dal";

export default function PanelInicioPage() {
  return (
    <Suspense fallback={<Skeleton className="h-16 w-80" />}>
      <Bienvenida />
    </Suspense>
  );
}

// Una tarjeta por módulo que el usuario tiene, con sus tareas más comunes.
async function Bienvenida() {
  const usuario = await exigirPanel();
  const modulos = navegacionPanel.flatMap((e) =>
    e.modulo && usuario.modulos.includes(e.modulo) ? [{ ...e, modulo: e.modulo }] : [],
  );

  return (
    <>
      <EncabezadoPagina
        titulo={`Hola, ${usuario.nombre}`}
        descripcion={
          modulos.length
            ? "¿Qué desea hacer hoy?"
            : "Su cuenta todavía no tiene módulos asignados. Pídale acceso a un administrador."
        }
      />
      <ul className="grid gap-4 movil:grid-cols-2 nav:grid-cols-3">
        {modulos.map(({ modulo, titulo, icono: Icono }) => (
          <li key={modulo} className="rounded-xl border bg-card p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold text-catsa-ink">
              <Icono className="size-4 text-catsa-green" aria-hidden />
              {titulo}
            </h2>
            <p className="mt-1 text-sm text-catsa-muted">{descripcionModulos[modulo].permite}</p>
            <ul className="mt-4 space-y-1">
              {accesosPanel[modulo].map((a) => (
                <li key={a.href}>
                  <Link
                    href={a.href}
                    className="group flex min-h-11 items-center justify-between gap-2 rounded-lg px-3 text-sm font-medium text-catsa-green transition-colors ease-catsa hover:bg-catsa-field"
                  >
                    {a.titulo}
                    <ArrowRight
                      className="size-4 transition-transform ease-catsa group-hover:translate-x-0.5 motion-reduce:transition-none"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}
