import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EncabezadoPagina } from "@/components/shared/encabezado-pagina";
import { GestorEtiquetas } from "@/components/shared/gestor-etiquetas";
import { Button } from "@/components/ui/button";
import { CargandoPagina } from "@/features/auth/components/protegido";
import { exigirModulo } from "@/features/auth/server/dal";
import { eliminarCategoria, guardarCategoria } from "@/features/noticias/actions";
import { listarCategoriasPanel } from "@/features/noticias/server/panel";

export const metadata: Metadata = { title: "Categorías de noticias" };

export default function CategoriasPage() {
  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/admin/noticias">
          <ArrowLeft aria-hidden />
          Noticias
        </Link>
      </Button>
      <EncabezadoPagina
        titulo="Categorías"
        descripcion="Agrupan las noticias. Las visibles aparecen como filtro en el sitio. Una categoría con noticias no se puede eliminar."
      />
      <Suspense fallback={<CargandoPagina />}>
        <Lista />
      </Suspense>
    </>
  );
}

async function Lista() {
  await exigirModulo("noticias");
  const categorias = await listarCategoriasPanel();
  return (
    <GestorEtiquetas
      items={categorias}
      conVisible
      nombreSingular="Categoría"
      guardar={guardarCategoria}
      eliminar={eliminarCategoria}
    />
  );
}
