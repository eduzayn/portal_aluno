import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
  
  test('renders validation form', () => {
    // Prevent the useEffect from running automatically
    jest.spyOn(React, 'useEffect').mockImplementationOnce(() => jest.fn());
    
    render(<QRCodeValidationPage />);
    
    expect(screen.getByText(/Validação de Credencial/i)).toBeInTheDocument();
  });
  
  test('validates credential from URL parameter', async () => {
    render(<QRCodeValidationPage />);
    
    // Wait for validation to complete
    await waitFor(() => {
      expect(screen.getByText(/Credencial Válida/i)).toBeInTheDocument();
    });
    
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
    
    render(<QRCodeValidationPage />);
    
    // Wait for validation to complete
    await waitFor(() => {
      expect(screen.getByText(/Credencial Inválida/i)).toBeInTheDocument();
    });
  });
  
  test('handles manual validation form submission', async () => {
    // Prevent the useEffect from running automatically
    jest.spyOn(React, 'useEffect').mockImplementationOnce(() => jest.fn());
    
    render(<QRCodeValidationPage />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Código QR/i), { target: { value: 'manual123' } });
    
    // Submit the form
    fireEvent.click(screen.getByText(/Validar Credencial/i));
    
    // Check if fetch was called with the right parameters
    expect(global.fetch).toHaveBeenCalledWith('/api/credentials/validate?qrcode=manual123');
    
    // Wait for validation to complete
    await waitFor(() => {
      expect(screen.getByText(/Credencial Válida/i)).toBeInTheDocument();
    });
  });
  
  test('handles validation error', async () => {
    // Mock fetch error
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    render(<QRCodeValidationPage />);
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Ocorreu um erro ao validar a credencial/i)).toBeInTheDocument();
    });
  });
  
  test('allows validating another credential', async () => {
    render(<QRCodeValidationPage />);
    
    // Wait for validation to complete
    await waitFor(() => {
      expect(screen.getByText(/Credencial Válida/i)).toBeInTheDocument();
    });
    
    // Click on "Validar Outra Credencial" button
    fireEvent.click(screen.getByText(/Validar Outra Credencial/i));
    
    // Check if form is displayed again
    expect(screen.getByLabelText(/Código QR/i)).toBeInTheDocument();
  });
});
