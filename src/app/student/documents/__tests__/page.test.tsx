import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentsPage from '../page';
import * as mockDataModule from '@/components/student/mock-data';
import { useAuth } from '@/contexts/AuthContext';

// Mock the auth context
jest.mock('@/contexts/AuthContext');
jest.mock('@/components/student/mock-data');

describe('DocumentsPage', () => {
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
    // Mock documents loading in progress
    (mockDataModule.getAcademicDocuments as jest.Mock).mockReturnValue(new Promise(() => {}));
    
    render(<DocumentsPage />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
  
  test('displays list of documents', async () => {
    // Mock documents data
    const mockDocuments = [
      {
        id: '1',
        studentId: '1',
        documentType: 'enrollment_declaration',
        title: 'Declaração de Matrícula',
        fileUrl: '/documents/enrollment-declaration.pdf',
        issueDate: '2023-01-20T14:30:00Z',
        metadata: {
          semester: '2023.1'
        }
      }
    ];
    
    (mockDataModule.getAcademicDocuments as jest.Mock).mockResolvedValue(mockDocuments);
    
    render(<DocumentsPage />);
    
    // Wait for documents to load
    await waitFor(() => {
      expect(screen.getByText(/Documentos Acadêmicos/i)).toBeInTheDocument();
    });
  });
});
