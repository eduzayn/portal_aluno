import { NextRequest } from 'next/server';

/**
 * Creates a mock NextRequest object for testing API routes
 */
export function createMockNextRequest(
  url: string,
  options?: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
  }
): NextRequest {
  const parsedUrl = new URL(url.startsWith('http') ? url : `http://localhost${url}`);
  
  // Create a headers object
  const headers = new Headers();
  if (options?.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      headers.append(key, value);
    });
  }
  
  // Create a mock request
  const mockRequest = {
    nextUrl: parsedUrl,
    url: parsedUrl.toString(),
    method: options?.method || 'GET',
    headers,
    json: async () => options?.body || {},
  } as unknown as NextRequest;
  
  return mockRequest;
}
