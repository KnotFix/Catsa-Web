"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Campo, conError } from "@/components/shared/campo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectorMedio } from "@/features/medios/components/selector-medio";
import type { Medio } from "@/features/medios/types";
import { guardarAjustes } from "../actions";
import type { AjustesPanel } from "../types";

type Clave = Exclude<
  keyof AjustesPanel,
  "imagen_compartir" | "vista_imagen" | "actualizado_en" | "actualizado_por"
>;
type Definicion = {
  clave: Clave;
  etiqueta: string;
  tipo?: "tel" | "email" | "url";
  maximo?: number;
  ayuda?: string;
  ejemplo?: string;
};

const GRUPOS: { titulo: string; campos: Definicion[] }[] = [
  {
    titulo: "Contacto",
    campos: [
      { clave: "telefono", etiqueta: "Teléfono", tipo: "tel", maximo: 30, ejemplo: "2690-1000" },
      {
        clave: "whatsapp",
        etiqueta: "WhatsApp",
        tipo: "tel",
        maximo: 15,
        ayuda: "Solo números, con el código de país.",
        ejemplo: "50626901000",
      },
      { clave: "correo", etiqueta: "Correo", tipo: "email", ejemplo: "info@catsa.net" },
    ],
  },
  {
    titulo: "Ubicación y horario",
    campos: [
      { clave: "direccion", etiqueta: "Dirección", maximo: 200, ejemplo: "Filadelfia, Carrillo, Guanacaste" },
      {
        clave: "horario",
        etiqueta: "Horario",
        maximo: 120,
        ejemplo: "Lunes a viernes, 7:00 a. m. a 4:00 p. m.",
      },
    ],
  },
  {
    titulo: "Redes sociales",
    campos: [
      { clave: "facebook", etiqueta: "Facebook", tipo: "url", ejemplo: "https://www.facebook.com/…" },
      { clave: "linkedin", etiqueta: "LinkedIn", tipo: "url", ejemplo: "https://www.linkedin.com/company/…" },
      { clave: "instagram", etiqueta: "Instagram", tipo: "url", ejemplo: "https://www.instagram.com/…" },
      { clave: "youtube", etiqueta: "YouTube", tipo: "url", ejemplo: "https://www.youtube.com/@…" },
    ],
  },
];

/** Lo que se deja vacío no aparece en el sitio. */
export function FormularioAjustes({
  ajustes,
  imagen,
  puedeSubir,
}: {
  ajustes: AjustesPanel;
  /** La imagen para compartir guardada, para mostrarla en el selector. */
  imagen: Medio | null;
  puedeSubir: boolean;
}) {
  const [valores, setValores] = useState<Record<Clave, string>>(
    () =>
      Object.fromEntries(
        GRUPOS.flatMap((g) => g.campos).map((c) => [c.clave, ajustes[c.clave] ?? ""]),
      ) as Record<Clave, string>,
  );
  const [compartir, setCompartir] = useState<Medio | null>(imagen);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [sucio, setSucio] = useState(false);
  const [ocupado, iniciar] = useTransition();

  function guardar() {
    iniciar(async () => {
      const resultado = await guardarAjustes({ ...valores, imagen_compartir: compartir?.id ?? null });
      if (!resultado.ok) {
        setErrores(resultado.campos ?? {});
        return void toast.error(resultado.error);
      }
      setErrores({});
      setSucio(false);
      toast.success("Guardado. El sitio ya muestra los cambios.");
    });
  }

  return (
    <form
      className="grid max-w-2xl gap-10"
      onSubmit={(e) => {
        e.preventDefault();
        guardar();
      }}
    >
      {GRUPOS.map((grupo) => (
        <fieldset key={grupo.titulo} className="grid gap-5">
          <legend className="mb-4 font-heading text-lg font-semibold text-catsa-ink">{grupo.titulo}</legend>
          {grupo.campos.map((campo) => {
            const id = `ajuste-${campo.clave}`;
            const error = errores[campo.clave];
            return (
              <Campo
                key={campo.clave}
                id={id}
                etiqueta={campo.etiqueta}
                ayuda={campo.ayuda}
                error={error}
                {...(campo.maximo &&
                  campo.tipo !== "tel" && { largo: valores[campo.clave].length, maximo: campo.maximo })}
              >
                <Input
                  id={id}
                  type={campo.tipo ?? "text"}
                  value={valores[campo.clave]}
                  maxLength={campo.maximo}
                  placeholder={campo.ejemplo && `Ej.: ${campo.ejemplo}`}
                  {...(campo.clave === "whatsapp" && { inputMode: "numeric" as const })}
                  onChange={(e) => {
                    setValores((actual) => ({ ...actual, [campo.clave]: e.target.value }));
                    setSucio(true);
                  }}
                  {...conError(id, error)}
                />
              </Campo>
            );
          })}
        </fieldset>
      ))}

      <fieldset className="grid gap-5">
        <legend className="mb-4 font-heading text-lg font-semibold text-catsa-ink">Al compartir</legend>
        <Campo
          id="ajuste-imagen"
          etiqueta="Imagen para compartir"
          ayuda="Sale en la vista previa de Facebook, LinkedIn o WhatsApp cuando la página no tiene una propia. Ideal: 1200 × 630 px."
          error={errores.imagen_compartir}
        >
          <SelectorMedio
            id="ajuste-imagen"
            tipo="imagen"
            valor={compartir}
            onCambio={(medio) => {
              setCompartir(medio);
              setSucio(true);
            }}
            puedeSubir={puedeSubir}
            invalido={Boolean(errores.imagen_compartir)}
          />
        </Campo>
      </fieldset>

      <Button type="submit" disabled={ocupado || !sucio} className="justify-self-start">
        {ocupado ? "Guardando…" : "Guardar y publicar"}
      </Button>
    </form>
  );
}
