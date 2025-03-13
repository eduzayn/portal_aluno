import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Completely disable middleware
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Empty matcher to prevent any middleware processing
export const config = {
  matcher: []
};
