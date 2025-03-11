/**
 * Creates a mock NextRequest object for testing API routes
 */
export function createMockNextRequest(url: string, options?: {
  method?: string;
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  body?: any;
}) {
  const defaultOptions = {
    method: 'GET',
    headers: {},
    cookies: {},
    ...options
  };

  // Create URL object
  const urlObj = new URL(url);
  
  // Create a mock NextRequest object
  return {
    url,
    method: defaultOptions.method,
    headers: new Headers(defaultOptions.headers),
    nextUrl: urlObj,
    cookies: {
      get: (name: string) => defaultOptions.cookies[name] || null,
      getAll: () => Object.entries(defaultOptions.cookies).map(([name, value]) => ({ name, value })),
    },
    json: async () => {
      if (defaultOptions.body && typeof defaultOptions.body === 'object') {
        return defaultOptions.body;
      }
      return {};
    },
    text: async () => {
      if (defaultOptions.body && typeof defaultOptions.body === 'string') {
        return defaultOptions.body;
      }
      return '';
    }
  };
}
