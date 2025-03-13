import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') || 
    pathname.includes('/static/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // If it's already a locale path, don't redirect
  if (pathname.startsWith('/pt-BR') || pathname.startsWith('/en')) {
    return NextResponse.next();
  }
  
  // For student routes, don't add locale prefix
  if (pathname.startsWith('/student')) {
    return NextResponse.next();
  }
  
  // For login and other auth routes, don't add locale prefix
  if (
    pathname === '/login' || 
    pathname === '/register' || 
    pathname === '/forgot-password' ||
    pathname === '/reset-password'
  ) {
    return NextResponse.next();
  }
  
  // Only redirect the root path to avoid loops
  if (pathname === '/') {
    // Check if there's a cookie or header indicating a previous redirect
    const redirectCount = request.cookies.get('redirect_count')?.value;
    
    // If we've already redirected once, don't redirect again
    if (redirectCount) {
      // Clear the cookie and proceed to the page
      const response = NextResponse.next();
      response.cookies.delete('redirect_count');
      return response;
    }
    
    // Set a cookie to track that we've redirected once
    const response = NextResponse.redirect(new URL('/student/dashboard', request.url));
    response.cookies.set('redirect_count', '1', { 
      maxAge: 10, // Short-lived cookie
      path: '/' 
    });
    return response;
  }
  
  // For all other paths, just proceed without redirecting
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
