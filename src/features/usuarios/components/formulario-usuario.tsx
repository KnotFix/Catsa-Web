"use client";

import { useId, useState, useTransition } from "react";
import { toast } from "sonner";
import { Campo, conError } from "@/components/shared/campo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { descripcionModulos, MODULOS, type Modulo } from "@/config/modulos";
import { guardarUsuario, invitarUsuario } from "../actions";
import type { UsuarioPanel } from "../types";

/** Invitar (sin `usuario`) o editar nombre, departamento y módulos. */
export function FormularioUsuario({ usuario }: { usuario?: UsuarioPanel }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState(usuario?.first_name ?? "");
  const [apellidos, setApellidos] = useState(usuario?.last_name ?? "");
  const [departamento, setDepartamento] = useState(usuario?.departamento ?? "");
  const [modulos, setModulos] = useState<Modulo[]>(usuario?.modulos ?? []);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [ocupado, iniciar] = useTransition();

  function alternar(modulo: Modulo, marcado: boolean) {
    setModulos((actuales) => (marcado ? [...actuales, modulo] : actuales.filter((m) => m !== modulo)));
  }

  function enviar() {
    if (modulos.length === 0) return setErrores({ modulos: "Elija al menos un módulo." });
    const datos = { first_name: nombre, last_name: apellidos, departamento, modulos };
    iniciar(async () => {
      const resultado = usuario
        ? await guardarUsuario(usuario.id, datos)
        : await invitarUsuario({ ...datos, email });
      if (!resultado.ok) {
        setErrores(resultado.campos ?? {});
        return void toast.error(resultado.error);
      }
      setErrores({});
      toast.success("Cambios guardados. Aplican de inmediato.");
    });
  }

  return (
    <form
      className="grid max-w-2xl gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        enviar();
      }}
    >
      {!usuario && (
        <Campo
          id={`${id}-email`}
          etiqueta="Correo"
          ayuda="Aquí le llega la invitación."
          error={errores.email}
        >
          <Input
            id={`${id}-email`}
            type="email"
            value={email}
            required
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            {...conError(`${id}-email`, errores.email)}
          />
        </Campo>
      )}
      <div className="grid gap-6 movil:grid-cols-2">
        <Campo id={`${id}-nombre`} etiqueta="Nombre" error={errores.first_name}>
          <Input
            id={`${id}-nombre`}
            value={nombre}
            maxLength={150}
            required
            onChange={(e) => setNombre(e.target.value)}
            {...conError(`${id}-nombre`, errores.first_name)}
          />
        </Campo>
        <Campo id={`${id}-apellidos`} etiqueta="Apellidos" error={errores.last_name}>
          <Input
            id={`${id}-apellidos`}
            value={apellidos}
            maxLength={150}
            onChange={(e) => setApellidos(e.target.value)}
          />
        </Campo>
      </div>
      <Campo
        id={`${id}-depto`}
        etiqueta="Departamento"
        ayuda="Ej.: Comunicación, Recursos Humanos"
        error={errores.departamento}
      >
        <Input
          id={`${id}-depto`}
          value={departamento}
          maxLength={80}
          onChange={(e) => setDepartamento(e.target.value)}
        />
      </Campo>

      <fieldset className="grid gap-3" aria-describedby={errores.modulos ? `${id}-modulos-error` : undefined}>
        <legend className="mb-1 text-sm font-medium">Módulos</legend>
        {MODULOS.map((modulo) => (
          <label
            key={modulo}
            htmlFor={`${id}-${modulo}`}
            className="flex cursor-pointer items-start gap-3 rounded-lg border bg-card p-3 has-data-[state=checked]:border-catsa-green"
          >
            <Checkbox
              id={`${id}-${modulo}`}
              checked={modulos.includes(modulo)}
              onCheckedChange={(v) => alternar(modulo, v === true)}
              className="mt-0.5"
            />
            <span>
              <span className="block text-sm font-semibold text-catsa-ink">
                {descripcionModulos[modulo].titulo}
              </span>
              <span className="block text-sm text-catsa-muted">{descripcionModulos[modulo].permite}</span>
            </span>
          </label>
        ))}
        {errores.modulos && (
          <p id={`${id}-modulos-error`} className="text-sm text-catsa-danger">
            {errores.modulos}
          </p>
        )}
      </fieldset>

      <Button type="submit" disabled={ocupado} className="justify-self-start">
        {usuario ? "Guardar cambios" : ocupado ? "Enviando…" : "Enviar invitación"}
      </Button>
    </form>
  );
}
