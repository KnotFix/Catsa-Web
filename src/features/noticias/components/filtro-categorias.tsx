import Link from "next/link";
import { etiquetaColor } from "@/lib/colores";
import { cn } from "@/lib/utils";
import { listarCategorias } from "../api";

/** Enlaces por categoría. Sin categorías visibles no se muestra nada. */
export async function FiltroCategorias({ activa }: { activa?: string }) {
  const categorias = await listarCategorias();
  if (categorias.length === 0) return null;

  const base = "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors";
  return (
    <nav aria-label="Categorías" className="mb-8 flex flex-wrap gap-2">
      <Link
        href="/noticias"
        aria-current={!activa ? "page" : undefined}
        className={cn(
          base,
          !activa ? "bg-catsa-ink text-white" : "bg-catsa-cream text-catsa-body hover:bg-catsa-cream-2",
        )}
      >
        Todas
      </Link>
      {categorias.map((categoria) => (
        <Link
          key={categoria.slug}
          href={`/noticias?categoria=${categoria.slug}`}
          aria-current={activa === categoria.slug ? "page" : undefined}
          className={cn(
            base,
            activa === categoria.slug ? "bg-catsa-ink text-white" : etiquetaColor[categoria.color],
          )}
        >
          {categoria.nombre}
        </Link>
      ))}
    </nav>
  );
}
