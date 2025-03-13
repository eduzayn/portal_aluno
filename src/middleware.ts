import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;
  
  // Special handling for root path only
  if (pathname === '/') {
    // Instead of redirecting, just pass through
    return NextResponse.next();
  }
  
  // Pass through all other requests
  return NextResponse.next();
}

// Only match the root path to prevent issues with other routes
export const config = {
  matcher: ['/']
};
