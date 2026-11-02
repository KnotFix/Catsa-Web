"use client";

import { useEffect, useState, useTransition } from "react";
import { idEtiqueta } from "@/components/shared/campo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buscarMedios } from "../actions";
import type { Medio, TipoMedio } from "../types";
import { SubirMedio } from "./subir-medio";
import { VistaMedio } from "./vista-medio";

/**
 * Campo de formulario para elegir un archivo de la biblioteca (o subir uno
 * nuevo, si el usuario tiene el módulo Biblioteca). Lo usan noticias, puestos
 * y contenido del sitio.
 */
export function SelectorMedio({
  id,
  tipo,
  valor,
  onCambio,
  puedeSubir,
  invalido,
}: {
  id: string;
  tipo: TipoMedio;
  valor: Medio | null;
  onCambio: (medio: Medio | null) => void;
  puedeSubir: boolean;
  invalido?: boolean;
}) {
  const [abierto, setAbierto] = useState(false);
  const elegir = (medio: Medio) => {
    onCambio(medio);
    setAbierto(false);
  };

  return (
    <div
      className="flex items-center gap-4 rounded-lg border bg-card p-3 aria-invalid:border-catsa-danger"
      aria-invalid={invalido || undefined}
    >
      {valor ? (
        <VistaMedio medio={valor} className="size-20 shrink-0" />
      ) : (
        <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-dashed text-xs text-catsa-muted">
          Sin {tipo === "imagen" ? "imagen" : "archivo"}
        </div>
      )}
      <div className="min-w-0 flex-1">
        {valor && <p className="truncate text-sm text-catsa-body">{valor.alt || valor.nombre}</p>}
        <div className="mt-2 flex gap-2">
          <Dialog open={abierto} onOpenChange={setAbierto}>
            <DialogTrigger asChild>
              <Button
                id={id}
                type="button"
                variant="outline"
                size="sm"
                // "Imagen destacada Elegir de la biblioteca": el campo y la acción.
                aria-labelledby={`${idEtiqueta(id)} ${id}`}
              >
                {valor ? "Cambiar" : "Elegir de la biblioteca"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{tipo === "imagen" ? "Elegir imagen" : "Elegir PDF"}</DialogTitle>
                <DialogDescription>Elija un archivo de la biblioteca o suba uno nuevo.</DialogDescription>
              </DialogHeader>
              {puedeSubir ? (
                <Tabs defaultValue="biblioteca">
                  <TabsList>
                    <TabsTrigger value="biblioteca">Biblioteca</TabsTrigger>
                    <TabsTrigger value="subir">Subir nuevo</TabsTrigger>
                  </TabsList>
                  <TabsContent value="biblioteca">
                    <Explorador tipo={tipo} onElegir={elegir} />
                  </TabsContent>
                  <TabsContent value="subir" className="pt-2">
                    <SubirMedio tipo={tipo} onSubido={elegir} />
                  </TabsContent>
                </Tabs>
              ) : (
                <Explorador tipo={tipo} onElegir={elegir} />
              )}
            </DialogContent>
          </Dialog>
          {valor && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onCambio(null)}>
              Quitar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Explorador({ tipo, onElegir }: { tipo: TipoMedio; onElegir: (medio: Medio) => void }) {
  const [buscar, setBuscar] = useState("");
  const [medios, setMedios] = useState<Medio[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, iniciar] = useTransition();

  useEffect(() => {
    // Espera a que se deje de escribir para no consultar en cada tecla.
    const espera = setTimeout(() => {
      iniciar(async () => {
        const resultado = await buscarMedios({ tipo, buscar: buscar.trim() || undefined });
        if (resultado.ok) {
          setMedios(resultado.datos.results);
          setError(null);
        } else {
          setError(resultado.error);
        }
      });
    }, 250);
    return () => clearTimeout(espera);
  }, [tipo, buscar]);

  return (
    <div className="grid gap-4 pt-2">
      <Input
        type="search"
        placeholder="Buscar por nombre o descripción"
        aria-label="Buscar en la biblioteca"
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
      />
      {error && <p className="text-sm text-catsa-danger">{error}</p>}
      {medios?.length === 0 && <p className="py-8 text-center text-sm text-catsa-muted">No hay archivos.</p>}
      <ul className="grid max-h-[50vh] grid-cols-3 gap-3 overflow-y-auto movil:grid-cols-4">
        {medios?.map((medio) => (
          <li key={medio.id}>
            <button
              type="button"
              onClick={() => onElegir(medio)}
              className="w-full rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              aria-label={`Elegir ${medio.alt || medio.nombre}`}
            >
              <VistaMedio medio={medio} className="transition-shadow hover:shadow-md" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
