import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Verificar se o usuário está autenticado para rotas protegidas
  if (!session && (
    req.nextUrl.pathname.startsWith('/student') ||
    req.nextUrl.pathname.startsWith('/admin')
  )) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirecionar usuários autenticados da página de login para o dashboard
  if (session && (
    req.nextUrl.pathname === '/login' ||
    req.nextUrl.pathname === '/register' ||
    req.nextUrl.pathname === '/forgot-password' ||
    req.nextUrl.pathname === '/'
  )) {
    return NextResponse.redirect(new URL('/student/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
