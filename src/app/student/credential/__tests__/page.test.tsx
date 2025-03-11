import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CredentialPage from '../page';
import * as mockDataModule from '@/components/student/mock-data';
import { useAuth } from '@/contexts/AuthContext';

// Mock the auth context
jest.mock('@/contexts/AuthContext');
jest.mock('@/components/student/mock-data');

describe('CredentialPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock auth context with a logged-in user
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        id: '1',
        name: 'João Silva',
        email: 'joao.silva@example.com',
        role: 'student',
      },
      loading: false,
    });
  });
  
  test('displays loading state initially', () => {
    // Mock credential loading in progress
    (mockDataModule.getStudentCredential as jest.Mock).mockReturnValue(new Promise(() => {}));
    
    render(<CredentialPage />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
  
  test('displays existing credential', async () => {
    // Mock existing credential
    const mockCredential = {
      id: '1',
      studentId: '1',
      photoUrl: '/images/avatars/avatar-1.png',
      qrCodeData: 'abc123xyz',
      issueDate: '2023-02-01T10:00:00Z',
      expiryDate: '2024-02-01T10:00:00Z',
      status: 'active'
    };
    
    (mockDataModule.getStudentCredential as jest.Mock).mockResolvedValue(mockCredential);
    
    render(<CredentialPage />);
    
    // Wait for credential to load
    await waitFor(() => {
      expect(screen.getByText(/Credencial do Estudante/i)).toBeInTheDocument();
    });
  });
});
