import { NextResponse, type NextRequest } from "next/server";

// Revisión optimista: solo mira si existe la cookie, sin llamar a Django.
// La validación real está en features/auth/server/dal.ts.
const COOKIE_SESION = "catsa_sesion";
const COOKIE_PENDIENTE = "catsa_sesion_pendiente";
const RUTAS_ACCESO = ["/admin/login", "/admin/verificar"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tieneSesion = request.cookies.has(COOKIE_SESION);
  const enAcceso = RUTAS_ACCESO.some((r) => pathname.startsWith(r));

  if (!enAcceso && !tieneSesion) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (pathname.startsWith("/admin/verificar") && !request.cookies.has(COOKIE_PENDIENTE)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
