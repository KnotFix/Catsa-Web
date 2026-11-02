"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { toast } from "sonner";
import { Campo, conError } from "@/components/shared/campo";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatearFecha } from "@/lib/formato";
import { actualizarMedio, eliminarMedio, verMedio } from "../actions";
import { formatearPeso, type Medio, type MedioDetalle } from "../types";
import { VistaMedio } from "./vista-medio";

export function DetalleMedio({
  medio,
  puedeEditar,
  puedeEliminar,
  onCerrar,
}: {
  medio: Medio;
  puedeEditar: boolean;
  puedeEliminar: boolean;
  onCerrar: () => void;
}) {
  const id = useId();
  // Dónde se usa llega aparte: la lista no lo trae para no consultar cada relación.
  const [detalle, setDetalle] = useState<MedioDetalle | null>(null);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [ocupado, iniciar] = useTransition();

  useEffect(() => {
    verMedio(medio.id).then((r) => r.ok && setDetalle(r.datos));
  }, [medio.id]);

  function guardar(datos: FormData) {
    iniciar(async () => {
      const resultado = await actualizarMedio(medio.id, {
        alt: String(datos.get("alt") ?? ""),
        nombre: String(datos.get("nombre") ?? ""),
      });
      if (!resultado.ok) return setErrores(resultado.campos ?? { alt: resultado.error });
      setErrores({});
      setDetalle(resultado.datos);
      toast.success("Cambios guardados");
    });
  }

  function eliminar() {
    iniciar(async () => {
      const resultado = await eliminarMedio(medio.id);
      if (!resultado.ok) return void toast.error(resultado.error);
      toast.success("Archivo eliminado");
      onCerrar();
    });
  }

  const usos = detalle?.usos;

  return (
    <Dialog open onOpenChange={(abierto) => !abierto && onCerrar()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="truncate pr-6">{medio.nombre}</DialogTitle>
          <DialogDescription>
            {medio.tipo === "imagen" ? `Imagen de ${medio.ancho} × ${medio.alto} px` : "Documento PDF"} ·{" "}
            {formatearPeso(medio.peso)} · subido el {formatearFecha(medio.creado_en)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 movil:grid-cols-[200px_1fr]">
          <div className="grid content-start gap-2">
            <VistaMedio medio={medio} />
            <a
              href={medio.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-catsa-green underline"
            >
              Abrir original
            </a>
          </div>

          <form
            className="grid content-start gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              guardar(new FormData(e.currentTarget));
            }}
          >
            <Campo id={`${id}-nombre`} etiqueta="Nombre" error={errores.nombre}>
              <Input
                id={`${id}-nombre`}
                name="nombre"
                defaultValue={medio.nombre}
                maxLength={255}
                disabled={!puedeEditar}
                {...conError(`${id}-nombre`, errores.nombre)}
              />
            </Campo>
            <Campo
              id={`${id}-alt`}
              etiqueta="Texto alternativo"
              ayuda={medio.tipo === "pdf" ? "Opcional en documentos." : undefined}
              error={errores.alt}
            >
              <Textarea
                id={`${id}-alt`}
                name="alt"
                defaultValue={medio.alt}
                maxLength={200}
                rows={3}
                disabled={!puedeEditar}
                {...conError(`${id}-alt`, errores.alt)}
              />
            </Campo>
            {puedeEditar && (
              <Button type="submit" disabled={ocupado} className="justify-self-start">
                Guardar
              </Button>
            )}
          </form>
        </div>

        <section className="border-t pt-4">
          <h3 className="text-sm font-semibold text-catsa-ink">Dónde se usa</h3>
          {!usos ? (
            <p className="mt-1 text-sm text-catsa-muted">Revisando…</p>
          ) : usos.length === 0 ? (
            <p className="mt-1 text-sm text-catsa-muted">No se usa en ningún lugar.</p>
          ) : (
            <ul className="mt-1 list-disc pl-5 text-sm text-catsa-body">
              {usos.map((uso) => (
                <li key={`${uso.modulo}-${uso.id}`}>
                  <span className="capitalize">{uso.modulo}</span>: {uso.titulo}
                </li>
              ))}
            </ul>
          )}
        </section>

        {puedeEliminar && (
          <div className="flex justify-end border-t pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={ocupado || !usos || usos.length > 0}>
                  Eliminar archivo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar «{medio.nombre}»?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Se borra para siempre. No se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={eliminar}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
