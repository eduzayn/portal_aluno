import { NextRequest } from 'next/server';

/**
 * Creates a mock NextRequest object for testing API routes
 * 
 * @param url The URL to use for the request
 * @param options Additional options for the request (method, headers, body)
 * @returns A mocked NextRequest object
 */
export function createMockNextRequest(
  url: string,
  options?: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    cookies?: Record<string, string>;
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
    cookies: {
      get: (name: string) => options?.cookies?.[name] ? { name, value: options.cookies[name] } : undefined,
      getAll: () => Object.entries(options?.cookies || {}).map(([name, value]) => ({ name, value })),
    },
    json: async () => options?.body || {},
    text: async () => JSON.stringify(options?.body || {}),
    formData: async () => {
      throw new Error('formData not implemented in mock');
    },
    blob: async () => {
      throw new Error('blob not implemented in mock');
    },
    arrayBuffer: async () => {
      throw new Error('arrayBuffer not implemented in mock');
    },
  } as unknown as NextRequest;
  
  return mockRequest;
}
