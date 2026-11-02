"use client";

import { useEffect, useId, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { toast } from "sonner";
import { Campo, conError } from "@/components/shared/campo";
import { EditorTexto } from "@/components/shared/editor-texto";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SelectorMedio } from "@/features/medios/components/selector-medio";
import type { Medio } from "@/features/medios/types";
import { abrirPuesto, cerrarPuesto, crearPuesto, eliminarPuesto, guardarPuesto } from "../../actions";
import {
  estadosPuesto,
  tiposContrato,
  type AreaPanel,
  type PuestoDetallePanel,
  type PuestoEntrada,
  type TipoContrato,
} from "../../types";

type Valores = Omit<PuestoEntrada, "ficha" | "area" | "cierra_el"> & {
  area: number | null;
  ficha: Medio | null;
  cierra_el: string;
};

const VACIO: Valores = {
  titulo: "",
  area: null,
  ubicacion: "",
  tipo_contrato: "indefinido",
  resumen: "",
  descripcion: "",
  requisitos: "",
  ofrecemos: "",
  ficha: null,
  correo_contacto: "",
  cierra_el: "",
};

/**
 * Crear (sin `puesto`) o editar un puesto. Sin autoguardado: los cambios de un
 * puesto abierto se ven en el sitio al guardar, así que se guarda a mano.
 */
export function FormularioPuesto({
  puesto: inicial,
  areas,
  ubicaciones,
  puedeSubir,
}: {
  puesto?: PuestoDetallePanel;
  areas: AreaPanel[];
  ubicaciones: string[];
  puedeSubir: boolean;
}) {
  const id = useId();
  const [puesto, setPuesto] = useState(inicial);
  const [valores, setValores] = useState<Valores>(
    inicial ? { ...inicial, area: inicial.area.id, cierra_el: inicial.cierra_el ?? "" } : VACIO,
  );
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [sucio, setSucio] = useState(false);
  const [ocupado, iniciar] = useTransition();

  const cambiar =
    <K extends keyof Valores>(campo: K) =>
    (valor: Valores[K]) => {
      setValores((v) => ({ ...v, [campo]: valor }));
      setSucio(true);
    };

  useEffect(() => {
    if (!sucio) return;
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [sucio]);

  function entrada(): PuestoEntrada | null {
    if (valores.area === null) {
      setErrores({ area: "Elija el área." });
      return null;
    }
    return {
      ...valores,
      area: valores.area,
      ficha: valores.ficha?.id ?? null,
      cierra_el: valores.cierra_el || null,
    };
  }

  async function guardar({ silencioso = false } = {}) {
    const datos = entrada();
    if (!datos) return false;
    const resultado = puesto ? await guardarPuesto(puesto.id, datos) : await crearPuesto(datos);
    if (!resultado.ok) {
      setErrores(resultado.campos ?? {});
      toast.error(resultado.error);
      return false;
    }
    setErrores({});
    setPuesto(resultado.datos);
    setSucio(false);
    if (!silencioso) toast.success("Cambios guardados");
    return true;
  }

  function transicion(accion: typeof abrirPuesto, mensaje: string) {
    if (!puesto) return;
    iniciar(async () => {
      if (sucio && !(await guardar({ silencioso: true }))) return;
      const resultado = await accion(puesto.id);
      if (!resultado.ok) {
        setErrores(resultado.campos ?? {});
        return void toast.error(resultado.error);
      }
      setPuesto(resultado.datos);
      toast.success(mensaje);
    });
  }

  const estado = puesto?.estado;

  return (
    <form
      className="grid gap-8"
      onSubmit={(e) => {
        e.preventDefault();
        iniciar(async () => void (await guardar()));
      }}
    >
      <div className="sticky top-0 z-10 -mx-8 -mt-8 flex flex-wrap items-center justify-between gap-3 border-b bg-catsa-field/95 px-8 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/puestos">
              <ArrowLeft aria-hidden />
              Puestos
            </Link>
          </Button>
          {estado && (
            <Badge variant={puesto.recibe_postulaciones ? "default" : "secondary"}>
              {estado === "abierto" && !puesto.recibe_postulaciones ? "Vencido" : estadosPuesto[estado]}
            </Badge>
          )}
          {sucio && puesto && <span className="text-xs text-catsa-muted">Cambios sin guardar</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {puesto && (
            <Button asChild variant="ghost" size="sm">
              <Link href={`/admin/puestos/${puesto.id}/vista-previa`} target="_blank">
                <Eye aria-hidden />
                Vista previa
              </Link>
            </Button>
          )}
          {puesto && puesto.publicado_en === null && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="ghost" size="sm" disabled={ocupado}>
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar este borrador?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Se borra para siempre. No se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      iniciar(async () => {
                        const r = await eliminarPuesto(puesto.id);
                        if (r && !r.ok) toast.error(r.error);
                      })
                    }
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {estado === "abierto" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={ocupado}
              onClick={() =>
                transicion(cerrarPuesto, "Puesto cerrado. Salió del listado; su enlace sigue funcionando.")
              }
            >
              Cerrar puesto
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            variant={puesto && estado !== "abierto" ? "outline" : "default"}
            disabled={ocupado || (Boolean(puesto) && !sucio)}
          >
            {puesto ? "Guardar cambios" : "Crear borrador"}
          </Button>
          {estado && estado !== "abierto" && (
            <Button
              type="button"
              size="sm"
              disabled={ocupado}
              onClick={() => transicion(abrirPuesto, "Puesto abierto. Ya se ve en el sitio.")}
            >
              {estado === "cerrado" ? "Reabrir" : "Abrir puesto"}
            </Button>
          )}
        </div>
      </div>

      {estado === "abierto" && (
        <p className="rounded-lg bg-catsa-amber-bg px-4 py-3 text-sm text-catsa-amber-ink">
          Este puesto está publicado: los cambios se ven en el sitio al guardarlos.
        </p>
      )}

      <div className="grid gap-8 nav:grid-cols-[1fr_20rem]">
        <div className="grid content-start gap-6">
          <Campo
            id={`${id}-titulo`}
            etiqueta="Título del puesto"
            error={errores.titulo}
            largo={valores.titulo.length}
            maximo={90}
          >
            <Input
              id={`${id}-titulo`}
              value={valores.titulo}
              maxLength={90}
              required
              className="h-11 text-lg"
              onChange={(e) => cambiar("titulo")(e.target.value)}
              {...conError(`${id}-titulo`, errores.titulo)}
            />
          </Campo>
          <Campo
            id={`${id}-resumen`}
            etiqueta="Resumen"
            ayuda="Se ve en el listado y al compartir el puesto en redes."
            error={errores.resumen}
            largo={valores.resumen.length}
            maximo={200}
          >
            <Textarea
              id={`${id}-resumen`}
              rows={2}
              maxLength={200}
              value={valores.resumen}
              onChange={(e) => cambiar("resumen")(e.target.value)}
              {...conError(`${id}-resumen`, errores.resumen)}
            />
          </Campo>
          <Campo id={`${id}-descripcion`} etiqueta="Descripción" error={errores.descripcion}>
            <EditorTexto
              id={`${id}-descripcion`}
              valor={valores.descripcion}
              onCambio={cambiar("descripcion")}
              invalido={Boolean(errores.descripcion)}
            />
          </Campo>
          <Campo id={`${id}-requisitos`} etiqueta="Requisitos" error={errores.requisitos}>
            <EditorTexto
              id={`${id}-requisitos`}
              valor={valores.requisitos}
              onCambio={cambiar("requisitos")}
              minimo="min-h-24"
            />
          </Campo>
          <Campo id={`${id}-ofrecemos`} etiqueta="Qué ofrecemos (opcional)" error={errores.ofrecemos}>
            <EditorTexto
              id={`${id}-ofrecemos`}
              valor={valores.ofrecemos}
              onCambio={cambiar("ofrecemos")}
              minimo="min-h-24"
            />
          </Campo>
        </div>

        <aside className="grid content-start gap-6">
          <Campo id={`${id}-area`} etiqueta="Área" error={errores.area}>
            <Select
              value={valores.area === null ? "" : String(valores.area)}
              onValueChange={(v) => cambiar("area")(Number(v))}
            >
              <SelectTrigger id={`${id}-area`} className="w-full" {...conError(`${id}-area`, errores.area)}>
                <SelectValue placeholder="Elija el área" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)}>
                    {a.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>
          <Campo
            id={`${id}-ubicacion`}
            etiqueta="Ubicación"
            ayuda="Se usa como filtro en el sitio."
            error={errores.ubicacion}
          >
            <Input
              id={`${id}-ubicacion`}
              list={`${id}-ubicaciones`}
              value={valores.ubicacion}
              maxLength={60}
              required
              onChange={(e) => cambiar("ubicacion")(e.target.value)}
              {...conError(`${id}-ubicacion`, errores.ubicacion)}
            />
            <datalist id={`${id}-ubicaciones`}>
              {ubicaciones.map((u) => (
                <option key={u} value={u} />
              ))}
            </datalist>
          </Campo>
          <Campo id={`${id}-contrato`} etiqueta="Tipo de contrato" error={errores.tipo_contrato}>
            <Select
              value={valores.tipo_contrato}
              onValueChange={(v) => cambiar("tipo_contrato")(v as TipoContrato)}
            >
              <SelectTrigger id={`${id}-contrato`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(tiposContrato) as TipoContrato[]).map((t) => (
                  <SelectItem key={t} value={t}>
                    {tiposContrato[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>
          <Campo
            id={`${id}-correo`}
            etiqueta="Correo para postularse"
            ayuda="A este correo llega el currículum."
            error={errores.correo_contacto}
          >
            <Input
              id={`${id}-correo`}
              type="email"
              value={valores.correo_contacto}
              required
              onChange={(e) => cambiar("correo_contacto")(e.target.value)}
              {...conError(`${id}-correo`, errores.correo_contacto)}
            />
          </Campo>
          <Campo
            id={`${id}-cierre`}
            etiqueta="Fecha de cierre (opcional)"
            ayuda="Ese día es el último en el listado. Después sale sola."
            error={errores.cierra_el}
          >
            <Input
              id={`${id}-cierre`}
              type="date"
              value={valores.cierra_el}
              onChange={(e) => cambiar("cierra_el")(e.target.value)}
              {...conError(`${id}-cierre`, errores.cierra_el)}
            />
          </Campo>
          <Campo id={`${id}-ficha`} etiqueta="Ficha en PDF (opcional)" error={errores.ficha}>
            <SelectorMedio
              id={`${id}-ficha`}
              tipo="pdf"
              valor={valores.ficha}
              onCambio={cambiar("ficha")}
              puedeSubir={puedeSubir}
              invalido={Boolean(errores.ficha)}
            />
          </Campo>
          {puesto?.publicado_en && (
            <p className="text-xs text-catsa-muted">
              Dirección: <span className="font-mono">/puestos/{puesto.slug}</span>
            </p>
          )}
        </aside>
      </div>
    </form>
  );
}
