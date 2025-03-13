import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './app/i18n';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export async function middleware(req: NextRequest) {
  // Check for public routes that don't need authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/api'];
  const url = req.nextUrl.clone();
  const path = url.pathname;
  
  // Allow public routes without authentication
  if (publicRoutes.some(route => path.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Check for temporary user cookie
  if (req.cookies.has('portal_aluno_temp_user')) {
    console.log('Middleware: Temporary user cookie found, allowing access');
    return NextResponse.next();
  }
  
  // Check for Supabase authentication
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  
  // If no session and not on a public route, redirect to login
  if (!session && !publicRoutes.some(route => path.startsWith(route))) {
    console.log('Middleware: No session found, redirecting to login');
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
