"use client";

import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChartColumn,
  Image as IconoImagen,
  Plus,
  Quote,
  Trash2,
  Type,
} from "lucide-react";
import { Campo } from "@/components/shared/campo";
import { EditorTexto } from "@/components/shared/editor-texto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectorMedio } from "@/features/medios/components/selector-medio";
import type { Medio } from "@/features/medios/types";
import type { BloqueEntrada } from "../../types";

/** Un bloque mientras se edita: la imagen lleva el medio completo para mostrarla. */
export type BloqueEnEdicion = { clave: string } & (
  Exclude<BloqueEntrada, { tipo: "imagen" }> | { tipo: "imagen"; medio: Medio | null; pie: string }
);

const NUEVOS: Record<BloqueEntrada["tipo"], () => BloqueEnEdicion> = {
  texto: () => ({ clave: crypto.randomUUID(), tipo: "texto", html: "" }),
  cita: () => ({ clave: crypto.randomUUID(), tipo: "cita", texto: "", autor: "" }),
  cifras: () => ({ clave: crypto.randomUUID(), tipo: "cifras", items: [{ valor: "", etiqueta: "" }] }),
  imagen: () => ({ clave: crypto.randomUUID(), tipo: "imagen", medio: null, pie: "" }),
};

const TITULOS: Record<BloqueEntrada["tipo"], { titulo: string; icono: ReactNode }> = {
  texto: { titulo: "Texto", icono: <Type /> },
  cita: { titulo: "Cita", icono: <Quote /> },
  cifras: { titulo: "Cifras destacadas", icono: <ChartColumn /> },
  imagen: { titulo: "Imagen", icono: <IconoImagen /> },
};

export function EditorBloques({
  bloques,
  onCambio,
  puedeSubir,
  error,
}: {
  bloques: BloqueEnEdicion[];
  onCambio: (bloques: BloqueEnEdicion[]) => void;
  puedeSubir: boolean;
  error?: string;
}) {
  const cambiar = (i: number, bloque: BloqueEnEdicion) => onCambio(bloques.with(i, bloque));
  const mover = (i: number, destino: number) => {
    const copia = [...bloques];
    [copia[i], copia[destino]] = [copia[destino], copia[i]];
    onCambio(copia);
  };

  return (
    <div className="grid gap-4">
      {bloques.length === 0 && (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-catsa-muted">
          La noticia todavía no tiene contenido. Agregue un bloque abajo.
        </p>
      )}

      {bloques.map((bloque, i) => (
        <section
          key={bloque.clave}
          aria-label={`Bloque ${i + 1}: ${TITULOS[bloque.tipo].titulo}`}
          className="rounded-xl border bg-card"
        >
          <header className="flex items-center justify-between gap-2 border-b px-4 py-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-catsa-ink [&_svg]:size-4">
              {TITULOS[bloque.tipo].icono}
              {TITULOS[bloque.tipo].titulo}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Subir bloque"
                disabled={i === 0}
                onClick={() => mover(i, i - 1)}
              >
                <ArrowUp />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Bajar bloque"
                disabled={i === bloques.length - 1}
                onClick={() => mover(i, i + 1)}
              >
                <ArrowDown />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Quitar bloque"
                onClick={() => onCambio(bloques.filter((_, j) => j !== i))}
              >
                <Trash2 />
              </Button>
            </div>
          </header>
          <div className="p-4">
            <ContenidoBloque bloque={bloque} onCambio={(b) => cambiar(i, b)} puedeSubir={puedeSubir} />
          </div>
        </section>
      ))}

      {error && <p className="text-sm text-catsa-danger">{error}</p>}

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-catsa-muted">Agregar:</span>
        {(Object.keys(NUEVOS) as BloqueEntrada["tipo"][]).map((tipo) => (
          <Button
            key={tipo}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onCambio([...bloques, NUEVOS[tipo]()])}
          >
            <Plus aria-hidden />
            {TITULOS[tipo].titulo}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ContenidoBloque({
  bloque,
  onCambio,
  puedeSubir,
}: {
  bloque: BloqueEnEdicion;
  onCambio: (bloque: BloqueEnEdicion) => void;
  puedeSubir: boolean;
}) {
  const id = bloque.clave;
  switch (bloque.tipo) {
    case "texto":
      return (
        <EditorTexto
          id={`${id}-html`}
          etiqueta="Texto del bloque"
          valor={bloque.html}
          onCambio={(html) => onCambio({ ...bloque, html })}
        />
      );

    case "cita":
      return (
        <div className="grid gap-4">
          <Campo id={`${id}-texto`} etiqueta="Cita" largo={bloque.texto.length} maximo={400}>
            <Textarea
              id={`${id}-texto`}
              rows={3}
              maxLength={400}
              value={bloque.texto}
              onChange={(e) => onCambio({ ...bloque, texto: e.target.value })}
            />
          </Campo>
          <Campo
            id={`${id}-autor`}
            etiqueta="Quién lo dice (opcional)"
            largo={bloque.autor.length}
            maximo={120}
          >
            <Input
              id={`${id}-autor`}
              maxLength={120}
              value={bloque.autor}
              onChange={(e) => onCambio({ ...bloque, autor: e.target.value })}
            />
          </Campo>
        </div>
      );

    case "cifras":
      return (
        <div className="grid gap-3">
          {bloque.items.map((cifra, i) => {
            const cambiar = (cambio: Partial<typeof cifra>) =>
              onCambio({ ...bloque, items: bloque.items.with(i, { ...cifra, ...cambio }) });
            return (
              <div key={i} className="grid items-end gap-3 movil:grid-cols-[10rem_1fr_auto]">
                <Campo id={`${id}-valor-${i}`} etiqueta="Cifra" ayuda="Ej.: 2 400 ha">
                  <Input
                    id={`${id}-valor-${i}`}
                    maxLength={20}
                    value={cifra.valor}
                    onChange={(e) => cambiar({ valor: e.target.value })}
                  />
                </Campo>
                <Campo id={`${id}-etiqueta-${i}`} etiqueta="Qué significa" ayuda="Ej.: listas para cosecha">
                  <Input
                    id={`${id}-etiqueta-${i}`}
                    maxLength={60}
                    value={cifra.etiqueta}
                    onChange={(e) => cambiar({ etiqueta: e.target.value })}
                  />
                </Campo>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Quitar cifra ${i + 1}`}
                  disabled={bloque.items.length === 1}
                  onClick={() => onCambio({ ...bloque, items: bloque.items.filter((_, j) => j !== i) })}
                  className="mb-5"
                >
                  <Trash2 />
                </Button>
              </div>
            );
          })}
          {bloque.items.length < 4 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="justify-self-start"
              onClick={() => onCambio({ ...bloque, items: [...bloque.items, { valor: "", etiqueta: "" }] })}
            >
              <Plus aria-hidden />
              Otra cifra
            </Button>
          )}
        </div>
      );

    case "imagen":
      return (
        <div className="grid gap-4">
          <SelectorMedio
            id={`${id}-medio`}
            tipo="imagen"
            valor={bloque.medio}
            onCambio={(medio) => onCambio({ ...bloque, medio })}
            puedeSubir={puedeSubir}
          />
          <Campo id={`${id}-pie`} etiqueta="Pie de foto (opcional)" largo={bloque.pie.length} maximo={160}>
            <Input
              id={`${id}-pie`}
              maxLength={160}
              value={bloque.pie}
              onChange={(e) => onCambio({ ...bloque, pie: e.target.value })}
            />
          </Campo>
        </div>
      );
  }
}
