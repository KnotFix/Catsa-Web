"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Etiqueta } from "@/components/shared/etiqueta";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Resultado } from "@/lib/api/resultado";
import type { Color } from "@/lib/api/tipos";

const COLORES: Record<Color, string> = { verde: "Verde", cafe: "Café", ambar: "Ámbar", neutro: "Neutro" };

export type EtiquetaEditable = {
  id: number;
  nombre: string;
  color?: Color;
  orden?: number;
  visible?: boolean;
};
type Cambios = Omit<EtiquetaEditable, "id">;

/**
 * Lista editable de categorías de noticias o áreas de puestos: nombre, color de
 * la paleta, orden y (en categorías) si se muestra como filtro en el sitio.
 */
export function GestorEtiquetas({
  items,
  conVisible,
  nombreSingular,
  guardar,
  eliminar,
}: {
  items: EtiquetaEditable[];
  conVisible?: boolean;
  nombreSingular: string;
  guardar: (id: number | null, datos: Cambios) => Promise<Resultado<unknown>>;
  eliminar: (id: number) => Promise<Resultado>;
}) {
  return (
    <div className="grid max-w-3xl gap-3">
      {items.map((item) => (
        <Fila key={item.id} item={item} conVisible={conVisible} guardar={guardar} eliminar={eliminar} />
      ))}
      <Fila
        key={`nueva-${items.length}`}
        item={{ id: 0, nombre: "", color: "verde", orden: items.length, visible: true }}
        nueva
        nombreSingular={nombreSingular}
        conVisible={conVisible}
        guardar={guardar}
      />
    </div>
  );
}

function Fila({
  item,
  nueva,
  nombreSingular,
  conVisible,
  guardar,
  eliminar,
}: {
  item: EtiquetaEditable;
  nueva?: boolean;
  nombreSingular?: string;
  conVisible?: boolean;
  guardar: (id: number | null, datos: Cambios) => Promise<Resultado<unknown>>;
  eliminar?: (id: number) => Promise<Resultado>;
}) {
  const [datos, setDatos] = useState<Cambios>(item);
  const [error, setError] = useState<string>();
  const [ocupado, iniciar] = useTransition();
  const cambiado = (["nombre", "color", "orden", "visible"] as const).some((c) => datos[c] !== item[c]);
  const prefijo = nueva ? "nueva" : `item-${item.id}`;

  function enviar() {
    iniciar(async () => {
      const { nombre, color, orden, visible } = datos;
      const resultado = await guardar(nueva ? null : item.id, {
        nombre,
        color,
        orden,
        ...(conVisible && { visible }),
      });
      if (!resultado.ok) return setError(resultado.campos?.nombre ?? resultado.error);
      setError(undefined);
      toast.success(nueva ? `${nombreSingular} creada` : "Cambios guardados");
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        enviar();
      }}
      className="grid items-center gap-3 rounded-xl border bg-card p-3 tablet:grid-cols-[1fr_9rem_5rem_auto_auto]"
      aria-label={nueva ? `Nueva ${nombreSingular?.toLowerCase()}` : item.nombre}
    >
      <div className="grid gap-1">
        <Input
          aria-label="Nombre"
          placeholder={nueva ? `Nueva ${nombreSingular?.toLowerCase()}` : undefined}
          value={datos.nombre}
          maxLength={40}
          required
          onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
          aria-invalid={Boolean(error) || undefined}
        />
        {error && <p className="text-sm text-catsa-danger">{error}</p>}
      </div>
      <Select value={datos.color} onValueChange={(color) => setDatos({ ...datos, color: color as Color })}>
        <SelectTrigger aria-label="Color" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(COLORES) as Color[]).map((c) => (
            <SelectItem key={c} value={c}>
              <Etiqueta color={c}>{COLORES[c]}</Etiqueta>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        aria-label="Orden"
        type="number"
        min={0}
        value={datos.orden ?? 0}
        onChange={(e) => setDatos({ ...datos, orden: Number(e.target.value) })}
      />
      {conVisible ? (
        <label htmlFor={`${prefijo}-visible`} className="flex items-center gap-2 text-sm">
          <Checkbox
            id={`${prefijo}-visible`}
            checked={datos.visible}
            onCheckedChange={(v) => setDatos({ ...datos, visible: v === true })}
          />
          Visible
        </label>
      ) : (
        <span />
      )}
      <div className="flex gap-1">
        <Button
          type="submit"
          size="sm"
          variant={nueva ? "default" : "outline"}
          disabled={ocupado || (!nueva && !cambiado)}
        >
          {nueva ? "Agregar" : "Guardar"}
        </Button>
        {eliminar && (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label={`Eliminar ${item.nombre}`}
            disabled={ocupado}
            onClick={() =>
              iniciar(async () => {
                const resultado = await eliminar(item.id);
                if (!resultado.ok) toast.error(resultado.error);
              })
            }
          >
            <Trash2 />
          </Button>
        )}
      </div>
    </form>
  );
}
