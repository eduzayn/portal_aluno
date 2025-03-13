import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Completely disable all redirects to fix the redirect loop issue
  // Just pass through all requests without any redirects
  return NextResponse.next();
}

// Temporarily disable the matcher to prevent any middleware processing
export const config = {
  matcher: []
};
