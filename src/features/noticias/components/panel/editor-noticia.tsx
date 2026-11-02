"use client";

import { useCallback, useEffect, useId, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SelectorMedio } from "@/features/medios/components/selector-medio";
import type { Medio } from "@/features/medios/types";
import { archivarNoticia, eliminarNoticia, guardarNoticia, publicarNoticia } from "../../actions";
import {
  estadosNoticia,
  type BloqueEntrada,
  type CategoriaPanel,
  type NoticiaDetallePanel,
  type NoticiaEntrada,
} from "../../types";
import { EditorBloques, type BloqueEnEdicion } from "./editor-bloques";

const SIN_CATEGORIA = "ninguna";
const ESPERA_AUTOGUARDADO = 3000;

/**
 * Lo que se manda a Django. Un bloque a medio llenar (texto vacío, imagen sin
 * elegir) se queda en el editor pero no se guarda: así el autoguardado no
 * falla mientras se escribe.
 */
function aEntrada(bloque: BloqueEnEdicion): BloqueEntrada[] {
  const { clave, ...b } = bloque;
  switch (b.tipo) {
    case "texto":
      return b.html.trim() ? [b] : [];
    case "cita":
      return b.texto.trim() ? [b] : [];
    case "cifras": {
      const items = b.items.filter((c) => c.valor.trim() && c.etiqueta.trim());
      return items.length ? [{ ...b, items }] : [];
    }
    case "imagen":
      return b.medio ? [{ tipo: "imagen", medio: b.medio.id, pie: b.pie }] : [];
  }
}

/**
 * Editor de una noticia. Un borrador se guarda solo mientras se escribe; una
 * publicada no, porque cada guardado cambia el sitio: ahí se guarda a mano.
 */
export function EditorNoticia({
  noticia: inicial,
  categorias,
  imagenes,
  puedeSubir,
}: {
  noticia: NoticiaDetallePanel;
  categorias: CategoriaPanel[];
  /** Medios de los bloques de imagen, por id, para mostrarlos. */
  imagenes: Record<number, Medio>;
  puedeSubir: boolean;
}) {
  const id = useId();
  const [noticia, setNoticia] = useState(inicial);
  const [titulo, setTitulo] = useState(inicial.titulo);
  const [resumen, setResumen] = useState(inicial.resumen);
  const [autor, setAutor] = useState(inicial.autor);
  const [categoria, setCategoria] = useState<number | null>(inicial.categoria?.id ?? null);
  const [portada, setPortada] = useState<Medio | null>(inicial.portada);
  const [bloques, setBloques] = useState<BloqueEnEdicion[]>(() =>
    inicial.bloques.map((b) =>
      b.tipo === "imagen"
        ? { ...b, clave: crypto.randomUUID(), medio: imagenes[b.medio] ?? null }
        : { ...b, clave: crypto.randomUUID() },
    ),
  );
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [sucio, setSucio] = useState(false);
  const [guardadoEn, setGuardadoEn] = useState<Date | null>(null);
  const [ocupado, iniciar] = useTransition();
  const version = useRef(0);

  const esBorrador = noticia.estado === "borrador";

  function marcar<T>(set: (valor: T) => void) {
    return (valor: T) => {
      set(valor);
      version.current += 1;
      setSucio(true);
    };
  }

  const datos = useCallback(
    (): NoticiaEntrada => ({
      titulo,
      resumen,
      autor,
      categoria,
      portada: portada?.id ?? null,
      bloques: bloques.flatMap(aEntrada),
    }),
    [titulo, resumen, autor, categoria, portada, bloques],
  );

  const guardar = useCallback(
    async ({ silencioso = false } = {}) => {
      const enviada = version.current;
      const resultado = await guardarNoticia(noticia.id, datos());
      if (!resultado.ok) {
        setErrores(resultado.campos ?? {});
        if (!silencioso) toast.error(resultado.error);
        return false;
      }
      setErrores({});
      setNoticia(resultado.datos);
      setGuardadoEn(new Date());
      // Si se siguió escribiendo mientras se guardaba, queda pendiente.
      if (version.current === enviada) setSucio(false);
      if (!silencioso) toast.success("Cambios guardados");
      return true;
    },
    [noticia.id, datos],
  );

  // Autoguardado de borradores.
  useEffect(() => {
    if (!sucio || !esBorrador || !titulo.trim()) return;
    const espera = setTimeout(() => void guardar({ silencioso: true }), ESPERA_AUTOGUARDADO);
    return () => clearTimeout(espera);
  }, [sucio, esBorrador, titulo, guardar]);

  // Aviso del navegador si se sale con cambios sin guardar.
  useEffect(() => {
    if (!sucio) return;
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [sucio]);

  function publicar() {
    iniciar(async () => {
      if (!(await guardar({ silencioso: true }))) return void toast.error("Revise los campos marcados.");
      const resultado = await publicarNoticia(noticia.id);
      if (!resultado.ok) {
        setErrores(resultado.campos ?? {});
        return void toast.error(resultado.error);
      }
      setNoticia(resultado.datos);
      toast.success("Noticia publicada. Ya se ve en el sitio.");
    });
  }

  function archivar() {
    iniciar(async () => {
      const resultado = await archivarNoticia(noticia.id);
      if (!resultado.ok) return void toast.error(resultado.error);
      setNoticia(resultado.datos);
      toast.success("Noticia archivada. Salió del listado; su enlace sigue funcionando.");
    });
  }

  function eliminar() {
    iniciar(async () => {
      const resultado = await eliminarNoticia(noticia.id);
      if (resultado && !resultado.ok) toast.error(resultado.error);
    });
  }

  return (
    <div className="grid gap-8">
      <div className="sticky top-0 z-10 -mx-8 -mt-8 flex flex-wrap items-center justify-between gap-3 border-b bg-catsa-field/95 px-8 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/noticias">
              <ArrowLeft aria-hidden />
              Noticias
            </Link>
          </Button>
          <Badge variant={noticia.estado === "publicada" ? "default" : "secondary"}>
            {estadosNoticia[noticia.estado]}
          </Badge>
          <span className="text-xs text-catsa-muted" aria-live="polite">
            {sucio
              ? esBorrador
                ? "Guardando pronto…"
                : "Cambios sin guardar"
              : guardadoEn
                ? `Guardado a las ${guardadoEn.toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" })}`
                : null}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/admin/noticias/${noticia.id}/vista-previa`} target="_blank">
              <Eye aria-hidden />
              Vista previa
            </Link>
          </Button>
          {noticia.publicada_en === null && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" disabled={ocupado}>
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
                  <AlertDialogAction onClick={eliminar}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {noticia.estado === "publicada" && (
            <Button variant="outline" size="sm" disabled={ocupado} onClick={archivar}>
              Archivar
            </Button>
          )}
          {!esBorrador && (
            <Button
              size="sm"
              variant={noticia.estado === "publicada" ? "default" : "outline"}
              disabled={ocupado || !sucio}
              onClick={() => iniciar(async () => void (await guardar()))}
            >
              Guardar cambios
            </Button>
          )}
          {noticia.estado !== "publicada" && (
            <Button size="sm" disabled={ocupado} onClick={publicar}>
              {noticia.estado === "archivada" ? "Publicar de nuevo" : "Publicar"}
            </Button>
          )}
        </div>
      </div>

      {noticia.estado === "publicada" && (
        <p className="rounded-lg bg-catsa-amber-bg px-4 py-3 text-sm text-catsa-amber-ink">
          Esta noticia está publicada: los cambios se ven en el sitio al guardarlos.
        </p>
      )}

      <div className="grid gap-8 nav:grid-cols-[1fr_20rem]">
        <div className="grid content-start gap-6">
          <Campo
            id={`${id}-titulo`}
            etiqueta="Título"
            error={errores.titulo}
            largo={titulo.length}
            maximo={120}
          >
            <Input
              id={`${id}-titulo`}
              value={titulo}
              maxLength={120}
              required
              className="h-11 text-lg"
              onChange={(e) => marcar(setTitulo)(e.target.value)}
              {...conError(`${id}-titulo`, errores.titulo)}
            />
          </Campo>
          <Campo
            id={`${id}-resumen`}
            etiqueta="Resumen"
            ayuda="Se ve en el listado y al compartir la noticia en redes."
            error={errores.resumen}
            largo={resumen.length}
            maximo={240}
          >
            <Textarea
              id={`${id}-resumen`}
              rows={3}
              value={resumen}
              maxLength={240}
              onChange={(e) => marcar(setResumen)(e.target.value)}
              {...conError(`${id}-resumen`, errores.resumen)}
            />
          </Campo>
          <div className="grid gap-2">
            <h2 className="text-lg text-catsa-ink">Contenido</h2>
            <EditorBloques
              bloques={bloques}
              onCambio={marcar(setBloques)}
              puedeSubir={puedeSubir}
              error={errores.bloques}
            />
          </div>
        </div>

        <aside className="grid content-start gap-6">
          <Campo
            id={`${id}-portada`}
            etiqueta="Imagen destacada"
            ayuda="Encabeza la noticia y la tarjeta del listado."
            error={errores.portada}
          >
            <SelectorMedio
              id={`${id}-portada`}
              tipo="imagen"
              valor={portada}
              onCambio={marcar(setPortada)}
              puedeSubir={puedeSubir}
              invalido={Boolean(errores.portada)}
            />
          </Campo>
          <Campo id={`${id}-categoria`} etiqueta="Categoría" error={errores.categoria}>
            <Select
              value={categoria === null ? SIN_CATEGORIA : String(categoria)}
              onValueChange={(v) => marcar(setCategoria)(v === SIN_CATEGORIA ? null : Number(v))}
            >
              <SelectTrigger id={`${id}-categoria`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SIN_CATEGORIA}>Sin categoría</SelectItem>
                {categorias.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>
          <Campo
            id={`${id}-autor`}
            etiqueta="Autor visible (opcional)"
            ayuda="Ej.: Comunicación CATSA"
            error={errores.autor}
          >
            <Input
              id={`${id}-autor`}
              value={autor}
              maxLength={80}
              onChange={(e) => marcar(setAutor)(e.target.value)}
            />
          </Campo>
          {noticia.publicada_en && (
            <p className="text-xs text-catsa-muted">
              Dirección: <span className="font-mono">/noticias/{noticia.slug}</span>
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
