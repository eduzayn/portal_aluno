import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import QRCodeValidationPage from '../page';

// Mock fetch
global.fetch = jest.fn();

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
  
  test('renders validation form', async () => {
    // Prevent the useEffect from running automatically
    jest.spyOn(React, 'useEffect').mockImplementationOnce(() => jest.fn());
    
    render(<QRCodeValidationPage />);
    
    expect(screen.getByText(/Validação de Credencial/i)).toBeInTheDocument();
  });
  
  test('validates credential from URL parameter', async () => {
    await act(async () => {
      render(<QRCodeValidationPage />);
    });
    
    // Wait for validation to complete
    await waitFor(() => {
      expect(screen.getByText(/Credencial Válida/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check if student information is displayed
    expect(screen.getByText(/João Silva/i)).toBeInTheDocument();
  });
  
  test('handles invalid credential', async () => {
    // Mock invalid credential response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Credential not found' }),
    });
    
    await act(async () => {
      render(<QRCodeValidationPage />);
    });
    
    // Wait for validation to complete
    await waitFor(() => {
      expect(screen.getByText(/Credencial Inválida/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
