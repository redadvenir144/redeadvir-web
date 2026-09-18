import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/session.shared';

const LOGIN_PATH = '/admin/login';

/**
 * Primera barrera del panel.
 *
 * Solo comprueba que exista la cookie de sesión: el middleware corre en el
 * Edge y no puede consultar Postgres. La validación real —que la sesión exista
 * y no haya caducado— la hace el layout del panel y cada Server Action.
 *
 * Su valor es el redirect temprano: evita cargar el panel entero para acabar
 * mandando al login.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // La comparación es exacta. Con un `(?!login)` en el matcher, una ruta como
  // /admin/loginx se habría colado sin pasar por aquí.
  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  if (!request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
