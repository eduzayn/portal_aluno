import { NextRequest } from 'next/server';
import { GET } from '../route';
import * as mockDataModule from '@/components/student/mock-data';

// Mock the mock-data module
jest.mock('@/components/student/mock-data');

describe('Credential Validation API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('returns 400 if qrcode is missing', async () => {
    // Create mock request without qrcode parameter
    const request = new NextRequest('http://localhost/api/credentials/validate');
    
    const response = await GET(request);
    
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('QR code is required');
  });
  
  test('returns 404 if credential not found', async () => {
    // Mock getStudentCredentialByQRCode to return null
    (mockDataModule.getStudentCredentialByQRCode as jest.Mock).mockResolvedValue(null);
    
    // Create mock request with qrcode parameter
    const request = new NextRequest('http://localhost/api/credentials/validate?qrcode=invalid123');
    
    const response = await GET(request);
    
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe('Credential not found');
  });
  
  test('returns 200 with valid credential', async () => {
    // Mock valid credential
    const mockCredential = {
      id: '1',
      studentId: '1',
      photoUrl: '/images/avatars/avatar-1.png',
      qrCodeData: 'valid123',
      issueDate: '2023-01-01T00:00:00Z',
      expiryDate: '2024-01-01T00:00:00Z',
      status: 'active',
      student: {
        name: 'João Silva',
        email: 'joao.silva@example.com'
      }
    };
    
    (mockDataModule.getStudentCredentialByQRCode as jest.Mock).mockResolvedValue(mockCredential);
    
    // Create mock request with valid qrcode parameter
    const request = new NextRequest('http://localhost/api/credentials/validate?qrcode=valid123');
    
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.valid).toBe(true);
    expect(data.credential).toEqual(mockCredential);
  });
});
