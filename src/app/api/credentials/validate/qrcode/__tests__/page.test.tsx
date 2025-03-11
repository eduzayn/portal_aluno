import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QRCodeValidationPage from '../page';

// Mock useSearchParams
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: (param) => {
      if (param === 'code') return 'abc123xyz';
      return null;
    }
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('QRCodeValidationPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful validation response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        valid: true,
        credential: {
          id: '1',
          studentId: '1',
          photoUrl: '/images/avatars/avatar-1.png',
          qrCodeData: 'abc123xyz',
          issueDate: '2023-01-01T00:00:00Z',
          expiryDate: '2024-01-01T00:00:00Z',
          status: 'active',
          student: {
            name: 'João Silva',
            email: 'joao.silva@example.com'
          }
        }
      }),
    });
  });
  
  test('validates credential from URL parameter', async () => {
    render(<QRCodeValidationPage />);
    
    // Wait for validation to complete
    await waitFor(() => {
      expect(screen.getByText(/Credencial Válida/i)).toBeInTheDocument();
    });
  });
});
