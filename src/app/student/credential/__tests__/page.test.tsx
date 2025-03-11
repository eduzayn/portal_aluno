import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudentCredentialPage from '../page';
import * as mockDataModule from '@/components/student/mock-data';

// Mock the AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  __esModule: true,
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

// Mock window.alert
window.alert = jest.fn();

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
    
    render(<StudentCredentialPage />);
    
    // Wait for the credential to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check if credential information is displayed
    expect(screen.getByText(/Credencial do Estudante/i)).toBeInTheDocument();
    expect(screen.getByText(/João Silva/i)).toBeInTheDocument();
    expect(screen.getByText(/Válida até/i)).toBeInTheDocument();
    
    // Test download functionality
    fireEvent.click(screen.getByText('Download'));
    expect(window.alert).toHaveBeenCalledWith('Funcionalidade de download será implementada em breve');
  });
  
  test('shows eligibility message when no credential exists but student is eligible', async () => {
    // Mock no existing credential but eligible student
    (mockDataModule.getStudentCredential as jest.Mock).mockResolvedValue(null);
    (mockDataModule.checkCredentialEligibility as jest.Mock).mockResolvedValue(true);
    
    render(<StudentCredentialPage />);
    
    // Wait for the eligibility check
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check if eligibility message is displayed
    expect(screen.getByText(/Você é elegível para obter sua credencial/i)).toBeInTheDocument();
    
    // Test generate credential functionality
    const newCredential = {
      id: '1',
      studentId: '1',
      photoUrl: '/images/avatars/avatar-1.png',
      qrCodeData: 'new123xyz',
      issueDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    };
    
    (mockDataModule.upsertStudentCredential as jest.Mock).mockResolvedValue(newCredential);
    
    fireEvent.click(screen.getByText('Gerar Credencial'));
    
    await waitFor(() => {
      expect(mockDataModule.upsertStudentCredential).toHaveBeenCalled();
    });
  });
  
  test('shows ineligibility message when student is not eligible', async () => {
    // Mock ineligible student
    (mockDataModule.getStudentCredential as jest.Mock).mockResolvedValue(null);
    (mockDataModule.checkCredentialEligibility as jest.Mock).mockResolvedValue(false);
    
    render(<StudentCredentialPage />);
    
    // Wait for the eligibility check
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    // Check if ineligibility message is displayed
    expect(screen.getByText(/Você ainda não é elegível para uma credencial/i)).toBeInTheDocument();
    expect(screen.getByText(/Completar pelo menos um curso/i)).toBeInTheDocument();
  });
  
  test('handles error when loading credential', async () => {
    // Mock error when loading credential
    (mockDataModule.getStudentCredential as jest.Mock).mockRejectedValue(
      new Error('Erro ao carregar credencial')
    );
    
    render(<StudentCredentialPage />);
    
    // Wait for the error state
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText(/Não foi possível carregar sua credencial/i)).toBeInTheDocument();
  });
});
