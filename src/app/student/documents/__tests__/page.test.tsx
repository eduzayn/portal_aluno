import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentsPage from '../page';
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
  getAcademicDocuments: jest.fn(),
}));

// Mock window.open
const mockOpen = jest.fn();
window.open = mockOpen;

describe('DocumentsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the getAcademicDocuments function with default documents
    (mockDataModule.getAcademicDocuments as jest.Mock).mockResolvedValue([
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
      },
      {
        id: '2',
        studentId: '1',
        documentType: 'grade_history',
        title: 'Histórico de Notas',
        fileUrl: '/documents/grade-history.pdf',
        issueDate: '2023-06-25T09:15:00Z',
        metadata: {
          semester: '2023.1',
          courses: ['Introdução à Programação']
        }
      },
      {
        id: '3',
        studentId: '1',
        documentType: 'course_completion',
        title: 'Declaração de Conclusão - Introdução à Programação',
        fileUrl: '/documents/course-completion-programming.pdf',
        issueDate: '2023-06-20T16:45:00Z',
        metadata: {
          courseId: '1',
          courseName: 'Introdução à Programação',
          completionDate: '2023-06-20',
          grade: 9.5
        }
      }
    ]);
  });
  
  test('renders loading state initially', () => {
    render(<DocumentsPage />);
    
    // Check if loading indicator is displayed
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
  
  test('displays all documents by default', async () => {
    render(<DocumentsPage />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check if all documents are displayed
    expect(screen.getAllByText(/Declaração de Matrícula/i)[1]).toBeInTheDocument(); // Get the document title, not the tab
    expect(screen.getAllByText(/Histórico de Notas/i)[1]).toBeInTheDocument(); // Get the document title, not the tab
    expect(screen.getByText(/Declaração de Conclusão - Introdução à Programação/i)).toBeInTheDocument();
  });
  
  test('handles document download', async () => {
    render(<DocumentsPage />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Click the download button for the first document
    const downloadButtons = screen.getAllByText('Download');
    fireEvent.click(downloadButtons[0]);
    
    // Check if download was triggered
    expect(mockOpen).toHaveBeenCalledWith('/documents/enrollment-declaration.pdf', '_blank');
  });
  
  test('handles document printing', async () => {
    render(<DocumentsPage />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Click the print button for the first document
    const printButtons = screen.getAllByText('Imprimir');
    fireEvent.click(printButtons[0]);
    
    // Check if print was triggered with correct URL
    expect(mockOpen).toHaveBeenCalledWith('/documents/enrollment-declaration.pdf?print=true', '_blank');
  });
  
  test('shows empty state when no documents are available', async () => {
    // Mock empty documents
    (mockDataModule.getAcademicDocuments as jest.Mock).mockResolvedValue([]);
    
    await act(async () => {
      render(<DocumentsPage />);
    });
    
    // Wait for the component to load and show empty state
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check if empty state message is displayed
    expect(screen.getByText(/Nenhum documento disponível/i)).toBeInTheDocument();
  });
  
  test('handles error when loading documents', async () => {
    // Mock error when loading documents
    (mockDataModule.getAcademicDocuments as jest.Mock).mockRejectedValue(
      new Error('Erro ao carregar documentos')
    );
    
    await act(async () => {
      render(<DocumentsPage />);
    });
    
    // Wait for the error state
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    expect(screen.getByText(/Não foi possível carregar seus documentos/i)).toBeInTheDocument();
  });
});
