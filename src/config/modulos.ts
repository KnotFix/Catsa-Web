import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import { Briefcase, FileText, House, Images, Newspaper, ShieldCheck } from "lucide-react";

/**
 * Módulos del panel (bitácora D-014). Cada uno es un grupo de permisos en
 * Django y un usuario puede tener varios. La clave debe coincidir con la que
 * devuelve /api/cuentas/yo/ en `modulos`.
 */
export const MODULOS = ["contenido", "noticias", "puestos", "medios", "administracion"] as const;
export type Modulo = (typeof MODULOS)[number];

type EntradaPanel = {
  titulo: string;
  href: Route;
  icono: LucideIcon;
  /** Sin módulo: lo ve cualquier usuario con sesión. */
  modulo?: Modulo;
};

export const navegacionPanel: EntradaPanel[] = [
  { titulo: "Inicio", href: "/admin", icono: House },
  { titulo: "Contenido del sitio", href: "/admin/contenido", icono: FileText, modulo: "contenido" },
  { titulo: "Noticias", href: "/admin/noticias", icono: Newspaper, modulo: "noticias" },
  { titulo: "Puestos", href: "/admin/puestos", icono: Briefcase, modulo: "puestos" },
  { titulo: "Biblioteca de medios", href: "/admin/medios", icono: Images, modulo: "medios" },
  { titulo: "Administración", href: "/admin/usuarios", icono: ShieldCheck, modulo: "administracion" },
];
