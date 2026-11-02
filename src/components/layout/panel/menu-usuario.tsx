import { LogOut } from "lucide-react";
import { cerrarSesion } from "@/features/auth/actions";

export function MenuUsuario({ nombre, email }: { nombre: string; email: string }) {
  return (
    <div className="mt-6 border-t border-sidebar-border px-3 pt-4">
      <p className="truncate text-sm font-semibold">{nombre}</p>
      <p className="truncate text-xs text-sidebar-foreground/60">{email}</p>
      <form action={cerrarSesion} className="mt-3">
        <button
          type="submit"
          className="flex items-center gap-2 text-xs text-sidebar-foreground/80 transition-colors hover:text-sidebar-primary"
        >
          <LogOut className="size-3.5" aria-hidden />
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}
