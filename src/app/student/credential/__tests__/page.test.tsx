import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudentCredentialPage from '../page';
import * as mockDataModule from '@/components/student/mock-data';

// Mock the AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@example.com',
      role: 'student',
      avatar_url: '/images/avatars/avatar-1.png',
    },
    loading: false,
  }),
}));

// Mock the mock-data module
jest.mock('@/components/student/mock-data', () => ({
  getStudentCredential: jest.fn(),
  checkCredentialEligibility: jest.fn(),
  upsertStudentCredential: jest.fn(),
}));

// Mock QRCodeSVG component
jest.mock('qrcode.react', () => ({
  QRCodeSVG: () => <div data-testid="qr-code">QR Code</div>,
}));

describe('StudentCredentialPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders loading state initially', () => {
    // Mock loading state
    (mockDataModule.getStudentCredential as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(null), 100))
    );
    
    render(<StudentCredentialPage />);
    
    // Check if loading indicator is displayed
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
  
  test('displays existing credential when available', async () => {
    // Mock existing credential
    (mockDataModule.getStudentCredential as jest.Mock).mockResolvedValue({
      id: '1',
      studentId: '1',
      photoUrl: '/images/avatars/avatar-1.png',
      qrCodeData: 'abc123xyz',
      issueDate: '2023-01-01T00:00:00Z',
      expiryDate: '2024-01-01T00:00:00Z',
      status: 'active'
    });
    
    await act(async () => {
      render(<StudentCredentialPage />);
    });
    
    // Wait for the credential to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check if credential information is displayed
    expect(screen.getByText(/Credencial do Estudante/i)).toBeInTheDocument();
    expect(screen.getByText(/João Silva/i)).toBeInTheDocument();
    expect(screen.getByText(/Válida até/i)).toBeInTheDocument();
  });
  
  test('shows eligibility message when no credential exists but student is eligible', async () => {
    // Mock no existing credential but eligible student
    (mockDataModule.getStudentCredential as jest.Mock).mockResolvedValue(null);
    (mockDataModule.checkCredentialEligibility as jest.Mock).mockResolvedValue(true);
    
    await act(async () => {
      render(<StudentCredentialPage />);
    });
    
    // Wait for the eligibility check
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check if eligibility message is displayed
    expect(screen.getByText(/Você é elegível para obter sua credencial/i)).toBeInTheDocument();
  });
  
  test('shows ineligibility message when student is not eligible', async () => {
    // Mock ineligible student
    (mockDataModule.getStudentCredential as jest.Mock).mockResolvedValue(null);
    (mockDataModule.checkCredentialEligibility as jest.Mock).mockResolvedValue(false);
    
    await act(async () => {
      render(<StudentCredentialPage />);
    });
    
    // Wait for the eligibility check
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check if ineligibility message is displayed
    expect(screen.getByText(/Você ainda não é elegível/i)).toBeInTheDocument();
  });
});
