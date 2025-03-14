import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './app/i18n';
import { createClient } from '@supabase/supabase-js';

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

// Content types that require full access
const educationalContentPaths = [
  '/student/courses',
  '/student/learning-path',
  '/student/lessons',
];

// Content types that are always accessible
const alwaysAccessiblePaths = [
  '/student/dashboard',
  '/student/financial',
  '/student/documents',
  '/student/profile',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api',
  '/student/restricted-access',
];

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
  
  // For educational content paths, check payment status
  if (session && educationalContentPaths.some(route => path.startsWith(route))) {
    try {
      // Create a direct Supabase client for the middleware
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabaseClient = createClient(supabaseUrl, supabaseKey);
      
      // Set the auth token from the session
      supabaseClient.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
      
      // Get student access status
      const { data: accessData, error: accessError } = await supabaseClient
        .from('student_access')
        .select('has_full_access')
        .eq('student_id', session.user.id)
        .single();
      
      // If there's an error or no access record, allow access by default
      if (accessError || !accessData) {
        console.log('Middleware: No access record found, allowing access by default');
        return res;
      }
      
      // If student doesn't have full access, redirect to restricted access page
      if (!accessData.has_full_access) {
        console.log('Middleware: Student has restricted access, redirecting');
        url.pathname = '/student/restricted-access';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Error checking access in middleware:', error);
      // Allow access by default if there's an error
      return res;
    }
  }
  
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
