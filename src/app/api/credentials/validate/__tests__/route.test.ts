import { NextRequest } from 'next/server';
import { GET } from '../route';

// Mock the supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true';

describe('Credential Validation API', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });
  
  test('returns 400 when no QR code is provided', async () => {
    // Create a mock request with no QR code
    const request = new NextRequest('http://localhost:3000/api/credentials/validate');
    
    // Call the API handler
    const response = await GET(request);
    
    // Check the response
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Código QR inválido ou ausente');
  });
  
  test('returns valid credential data for valid QR code', async () => {
    // Create a mock request with a valid QR code
    const request = new NextRequest('http://localhost:3000/api/credentials/validate?code=abc123xyz');
    
    // Call the API handler
    const response = await GET(request);
    
    // Check the response
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.valid).toBe(true);
    expect(data.student).toBeDefined();
    expect(data.student.name).toBe('João Silva');
  });
  
  test('returns invalid response for invalid QR code', async () => {
    // Create a mock request with an invalid QR code
    const request = new NextRequest('http://localhost:3000/api/credentials/validate?code=invalid');
    
    // Call the API handler
    const response = await GET(request);
    
    // Check the response
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.valid).toBe(false);
    expect(data.message).toBe('Credencial não encontrada');
  });
  
  test('returns expired response for expired QR code', async () => {
    // Create a mock request with an expired QR code
    const request = new NextRequest('http://localhost:3000/api/credentials/validate?code=expired');
    
    // Call the API handler
    const response = await GET(request);
    
    // Check the response
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.valid).toBe(false);
    expect(data.message).toBe('Credencial expirada');
    expect(data.status).toBe('expired');
  });
  
  test('returns revoked response for revoked QR code', async () => {
    // Create a mock request with a revoked QR code
    const request = new NextRequest('http://localhost:3000/api/credentials/validate?code=revoked');
    
    // Call the API handler
    const response = await GET(request);
    
    // Check the response
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.valid).toBe(false);
    expect(data.message).toBe('Credencial revogada');
    expect(data.status).toBe('revoked');
  });
});
