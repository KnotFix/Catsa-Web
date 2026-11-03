import Link from "next/link";
import { cn } from "@/lib/utils";

/** Usuarios | Registro de accesos. */
export function PestanasAdministracion({ activa }: { activa: "usuarios" | "accesos" }) {
  const clase = (esta: boolean) =>
    cn(
      "rounded-md px-3 py-1.5 text-sm font-semibold",
      esta ? "bg-catsa-ink text-white" : "text-catsa-body hover:bg-catsa-cream",
    );
  return (
    <nav aria-label="Administración" className="mb-6 flex w-fit gap-1 rounded-lg bg-card p-1">
      <Link
        href="/admin/usuarios"
        aria-current={activa === "usuarios" ? "page" : undefined}
        className={clase(activa === "usuarios")}
      >
        Usuarios
      </Link>
      <Link
        href="/admin/usuarios/accesos"
        aria-current={activa === "accesos" ? "page" : undefined}
        className={clase(activa === "accesos")}
      >
        Registro de accesos
      </Link>
    </nav>
  );
}
