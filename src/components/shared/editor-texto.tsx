"use client";

import type { ReactNode } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Quote } from "lucide-react";
import { idEtiqueta } from "@/components/shared/campo";
import { cn } from "@/lib/utils";

/**
 * Editor de texto con formato. Solo ofrece lo que Django deja pasar
 * (apps/core/html.py): párrafos, negrita, cursiva, subtítulos, listas, citas
 * y enlaces. Así lo que se ve aquí es lo que se publica.
 */
export function EditorTexto({
  id,
  etiqueta,
  valor,
  onCambio,
  invalido,
  minimo = "min-h-32",
}: {
  id: string;
  /** Nombre accesible si el editor no está dentro de un <Campo> (que ya lo nombra). */
  etiqueta?: string;
  valor: string;
  onCambio: (html: string) => void;
  invalido?: boolean;
  minimo?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        horizontalRule: false,
        strike: false,
        link: { openOnClick: false, autolink: true, protocols: ["mailto", "tel"] },
      }),
    ],
    content: valor,
    // Next renderiza en el servidor: el editor se monta recién en el navegador.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        id,
        class: cn("prosa prosa-panel px-3 py-2 outline-none", minimo),
        "aria-multiline": "true",
        ...(etiqueta ? { "aria-label": etiqueta } : { "aria-labelledby": idEtiqueta(id) }),
        role: "textbox",
        ...(invalido && { "aria-invalid": "true" }),
      },
    },
    onUpdate: ({ editor }) => onCambio(editor.isEmpty ? "" : editor.getHTML()),
  });

  const activo = useEditorState({
    editor,
    selector: ({ editor }) => ({
      negrita: editor?.isActive("bold") ?? false,
      cursiva: editor?.isActive("italic") ?? false,
      h2: editor?.isActive("heading", { level: 2 }) ?? false,
      h3: editor?.isActive("heading", { level: 3 }) ?? false,
      lista: editor?.isActive("bulletList") ?? false,
      numerada: editor?.isActive("orderedList") ?? false,
      cita: editor?.isActive("blockquote") ?? false,
      enlace: editor?.isActive("link") ?? false,
    }),
  });

  function enlazar() {
    if (!editor) return;
    const actual = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Dirección del enlace (vacío para quitarlo)", actual ?? "https://");
    if (url === null) return;
    const cadena = editor.chain().focus().extendMarkRange("link");
    if (url.trim() === "" || url === "https://") cadena.unsetLink().run();
    else cadena.setLink({ href: url.trim() }).run();
  }

  const c = () => editor?.chain().focus();

  return (
    <div
      className={cn(
        "rounded-md border bg-card focus-within:ring-2 focus-within:ring-ring",
        invalido && "border-catsa-danger",
      )}
    >
      <div role="toolbar" aria-label="Formato" className="flex flex-wrap gap-0.5 border-b p-1">
        <Boton titulo="Negrita" activo={activo?.negrita} onClick={() => c()?.toggleBold().run()}>
          <Bold />
        </Boton>
        <Boton titulo="Cursiva" activo={activo?.cursiva} onClick={() => c()?.toggleItalic().run()}>
          <Italic />
        </Boton>
        <Boton titulo="Subtítulo" activo={activo?.h2} onClick={() => c()?.toggleHeading({ level: 2 }).run()}>
          <Heading2 />
        </Boton>
        <Boton
          titulo="Subtítulo menor"
          activo={activo?.h3}
          onClick={() => c()?.toggleHeading({ level: 3 }).run()}
        >
          <Heading3 />
        </Boton>
        <Boton titulo="Lista" activo={activo?.lista} onClick={() => c()?.toggleBulletList().run()}>
          <List />
        </Boton>
        <Boton
          titulo="Lista numerada"
          activo={activo?.numerada}
          onClick={() => c()?.toggleOrderedList().run()}
        >
          <ListOrdered />
        </Boton>
        <Boton titulo="Cita" activo={activo?.cita} onClick={() => c()?.toggleBlockquote().run()}>
          <Quote />
        </Boton>
        <Boton titulo="Enlace" activo={activo?.enlace} onClick={enlazar}>
          <Link2 />
        </Boton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function Boton({
  titulo,
  activo,
  onClick,
  children,
}: {
  titulo: string;
  activo?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={titulo}
      aria-label={titulo}
      aria-pressed={activo}
      onClick={onClick}
      className={cn(
        "rounded p-1.5 text-catsa-body transition-colors hover:bg-catsa-cream [&_svg]:size-4",
        activo && "bg-catsa-cream-2 text-catsa-ink",
      )}
    >
      {children}
    </button>
  );
}
