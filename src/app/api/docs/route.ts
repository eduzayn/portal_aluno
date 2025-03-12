import { NextResponse } from 'next/server';
import { spec } from '../documentation';

/**
 * API route to serve the OpenAPI specification for the Student Portal
 */
export async function GET() {
  return NextResponse.json(spec);
}
