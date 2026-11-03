"use client";

import { useTransition } from "react";
import { toast } from "sonner";
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
import { accionUsuario } from "../actions";
import type { UsuarioPanel } from "../types";

/** Reenviar invitación, restablecer 2FA, desactivar o reactivar. Cada una se confirma antes. */
export function AccionesUsuario({ usuario, esUnoMismo }: { usuario: UsuarioPanel; esUnoMismo: boolean }) {
  const [ocupado, iniciar] = useTransition();

  function ejecutar(accion: Parameters<typeof accionUsuario>[1], mensaje: string) {
    iniciar(async () => {
      const resultado = await accionUsuario(usuario.id, accion);
      if (!resultado.ok) return void toast.error(resultado.error);
      toast.success(mensaje);
    });
  }

  if (esUnoMismo) {
    return (
      <p className="text-sm text-catsa-muted">
        Es su propia cuenta: no puede desactivarla ni restablecer su 2FA aquí.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {usuario.activo && usuario.invitacion_pendiente && (
        <Accion
          titulo="Reenviar invitación"
          pregunta={`¿Reenviar la invitación a ${usuario.email}?`}
          detalle="Le llega un enlace nuevo, válido por 3 días. El anterior sigue sirviendo hasta que venza o se use."
          confirmar="Reenviar"
          ocupado={ocupado}
          onConfirmar={() => ejecutar("reenviar-invitacion", "Invitación reenviada")}
        />
      )}
      {usuario.activo && usuario.tiene_2fa && (
        <Accion
          titulo="Restablecer verificación en dos pasos"
          pregunta={`¿Restablecer la verificación de ${usuario.nombre}?`}
          detalle="Para cuando perdió o cambió el teléfono. Se borran su app y sus códigos de respaldo; la configura de nuevo en su próximo ingreso."
          confirmar="Restablecer"
          ocupado={ocupado}
          onConfirmar={() => ejecutar("restablecer-2fa", "Verificación restablecida")}
        />
      )}
      {usuario.activo ? (
        <Accion
          titulo="Desactivar cuenta"
          pregunta={`¿Desactivar la cuenta de ${usuario.nombre}?`}
          detalle="No podrá volver a entrar y su sesión abierta se corta. Lo que publicó se mantiene en el sitio. Se puede reactivar."
          confirmar="Desactivar"
          peligro
          ocupado={ocupado}
          onConfirmar={() => ejecutar("desactivar", "Cuenta desactivada")}
        />
      ) : (
        <Button variant="outline" disabled={ocupado} onClick={() => ejecutar("activar", "Cuenta reactivada")}>
          Reactivar cuenta
        </Button>
      )}
    </div>
  );
}

function Accion({
  titulo,
  pregunta,
  detalle,
  confirmar,
  peligro,
  ocupado,
  onConfirmar,
}: {
  titulo: string;
  pregunta: string;
  detalle: string;
  confirmar: string;
  peligro?: boolean;
  ocupado: boolean;
  onConfirmar: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={peligro ? "destructive" : "outline"} disabled={ocupado}>
          {titulo}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{pregunta}</AlertDialogTitle>
          <AlertDialogDescription>{detalle}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmar}>{confirmar}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
