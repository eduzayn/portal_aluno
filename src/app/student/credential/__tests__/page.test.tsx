import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CredentialPage from '../page';
import { useAuth } from '@/contexts/AuthContext';
import * as mockDataModule from '@/components/student/mock-data';

// Mock the AuthContext
jest.mock('@/contexts/AuthContext');
// Mock the mock-data module
jest.mock('@/components/student/mock-data');

// Mock QRCode component
jest.mock('qrcode.react', () => ({
  __esModule: true,
  default: ({ value }: { value: string }) => <div data-testid="qr-code">{value}</div>,
}));

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

describe('CredentialPage', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock the useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: '1',
        name: 'João Silva',
        email: 'joao.silva@example.com',
        role: 'student',
        avatar_url: '/images/avatars/avatar-1.png',
      },
      loading: false,
    });
    
    // Mock the getStudentCredential function
    (mockDataModule.getStudentCredential as jest.Mock).mockResolvedValue(null);
    
    // Mock the checkCredentialEligibility function
    (mockDataModule.checkCredentialEligibility as jest.Mock).mockResolvedValue(true);
    
    // Mock the upsertStudentCredential function
    (mockDataModule.upsertStudentCredential as jest.Mock).mockResolvedValue({
      id: '1',
      studentId: '1',
      photoUrl: '/images/avatars/avatar-1.png',
      qrCodeData: 'abc123xyz',
      issueDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    });
    
    // Mock window.print
    global.print = jest.fn();
    window.print = global.print;
  });
  
  test('renders loading state initially', async () => {
    // Mock loading state
    (mockDataModule.getStudentCredential as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(null), 100))
    );
    
    render(<CredentialPage />);
    
    // Check if loading indicator is displayed
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  
  test('shows eligibility message when student is eligible', async () => {
    render(<CredentialPage />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText(/Gerar Credencial de Estudante/i)).toBeInTheDocument();
    });
    
    // Check if eligibility message is displayed
    expect(screen.getByText(/Você é elegível para emitir sua credencial/i)).toBeInTheDocument();
  });
  
  test('shows ineligibility message when student is not eligible', async () => {
    // Mock student as ineligible
    (mockDataModule.checkCredentialEligibility as jest.Mock).mockResolvedValue(false);
    
    render(<CredentialPage />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText(/Credencial não disponível/i)).toBeInTheDocument();
    });
    
    // Check if ineligibility message is displayed
    expect(screen.getByText(/Você ainda não é elegível/i)).toBeInTheDocument();
  });
  
  test('displays existing credential when available', async () => {
    // Mock existing credential
    const mockCredential = {
      id: '1',
      studentId: '1',
      photoUrl: '/images/avatars/avatar-1.png',
      qrCodeData: 'abc123xyz',
      issueDate: '2023-01-01T00:00:00Z',
      expiryDate: '2024-01-01T00:00:00Z',
      status: 'active'
    };
    
    (mockDataModule.getStudentCredential as jest.Mock).mockResolvedValue(mockCredential);
    
    render(<CredentialPage />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText(/João Silva/i)).toBeInTheDocument();
    });
    
    // Check if credential details are displayed
    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    expect(screen.getByText(/Emissão:/i)).toBeInTheDocument();
    expect(screen.getByText(/Validade:/i)).toBeInTheDocument();
    
    // Check if action buttons are available
    expect(screen.getByText(/Imprimir/i)).toBeInTheDocument();
    expect(screen.getByText(/Download PDF/i)).toBeInTheDocument();
  });
  
  // Additional tests can be added for:
  // - Testing the photo capture functionality
  // - Testing the credential generation process
  // - Testing the print and download functionality
});
