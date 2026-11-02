"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Campo, conError } from "@/components/shared/campo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectorMedio } from "@/features/medios/components/selector-medio";
import type { Medio } from "@/features/medios/types";
import { guardarEspacio } from "../actions";
import type { EspacioPanel } from "../types";

type Valor = string | Medio | null;

/**
 * Formulario de un espacio editable, armado con los campos que declara Django.
 * Si nunca se editó, arranca con el texto del diseño que hoy se ve en el sitio.
 */
export function FormularioEspacio({
  espacio,
  porDefecto,
  imagenes,
  puedeSubir,
}: {
  espacio: EspacioPanel;
  porDefecto: Record<string, unknown>;
  /** Medios de los campos de imagen, por clave del campo. */
  imagenes: Record<string, Medio>;
  puedeSubir: boolean;
}) {
  const [valores, setValores] = useState<Record<string, Valor>>(() =>
    Object.fromEntries(
      espacio.campos.map((c) => [
        c.clave,
        c.tipo === "imagen"
          ? (imagenes[c.clave] ?? null)
          : String((espacio.datos ?? porDefecto)[c.clave] ?? ""),
      ]),
    ),
  );
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [sucio, setSucio] = useState(false);
  const [ocupado, iniciar] = useTransition();

  function guardar() {
    const datos = Object.fromEntries(
      Object.entries(valores).map(([clave, v]) => [clave, v !== null && typeof v === "object" ? v.id : v]),
    );
    iniciar(async () => {
      const resultado = await guardarEspacio(espacio.clave, datos);
      if (!resultado.ok) {
        setErrores(resultado.campos ?? {});
        return void toast.error(resultado.error);
      }
      setErrores({});
      setSucio(false);
      toast.success("Guardado. El sitio ya muestra el cambio.");
    });
  }

  return (
    <form
      className="grid max-w-2xl gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        guardar();
      }}
    >
      {espacio.campos.map((campo) => {
        const id = `campo-${campo.clave}`;
        const valor = valores[campo.clave];
        const cambiar = (v: Valor) => {
          setValores((actual) => ({ ...actual, [campo.clave]: v }));
          setSucio(true);
        };
        const error = errores[campo.clave];
        const texto = typeof valor === "string" ? valor : "";

        if (campo.tipo === "imagen") {
          return (
            <Campo
              key={campo.clave}
              id={id}
              etiqueta={campo.etiqueta}
              ayuda={campo.ayuda || undefined}
              error={error}
            >
              <SelectorMedio
                id={id}
                tipo="imagen"
                valor={valor as Medio | null}
                onCambio={cambiar}
                puedeSubir={puedeSubir}
                invalido={Boolean(error)}
              />
            </Campo>
          );
        }
        const Control = campo.tipo === "parrafo" ? Textarea : Input;
        return (
          <Campo
            key={campo.clave}
            id={id}
            etiqueta={campo.etiqueta}
            ayuda={campo.ayuda || undefined}
            error={error}
            largo={texto.length}
            maximo={campo.maximo ?? undefined}
          >
            <Control
              id={id}
              value={texto}
              maxLength={campo.maximo ?? undefined}
              required={campo.requerido}
              {...(campo.tipo === "parrafo" && { rows: 4 })}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                cambiar(e.target.value)
              }
              {...conError(id, error)}
            />
          </Campo>
        );
      })}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={ocupado || !sucio}>
          {ocupado ? "Guardando…" : "Guardar y publicar"}
        </Button>
        {!espacio.datos && !sucio && (
          <span className="text-sm text-catsa-muted">Muestra el texto del diseño original.</span>
        )}
      </div>
    </form>
  );
}
