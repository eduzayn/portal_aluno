import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentsPage from '../page';
import { useAuth } from '@/contexts/AuthContext';
import * as mockDataModule from '@/components/student/mock-data';

// Mock the AuthContext
jest.mock('@/contexts/AuthContext');
// Mock the mock-data module
jest.mock('@/components/student/mock-data');

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('DocumentsPage', () => {
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
    
    // Mock the getAcademicDocuments function
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
    
    // Mock window.alert
    global.alert = jest.fn();
    window.alert = global.alert;
  });
  
  test('renders loading state initially', async () => {
    // Mock loading state
    (mockDataModule.getAcademicDocuments as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 100))
    );
    
    render(<DocumentsPage />);
    
    // Check if loading indicator is displayed
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  
  test('displays all documents when loaded', async () => {
    render(<DocumentsPage />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText(/Documentos Acadêmicos/i)).toBeInTheDocument();
    });
    
    // Check if all documents are displayed
    expect(screen.getByText('Declaração de Matrícula')).toBeInTheDocument();
    expect(screen.getByText('Histórico de Notas')).toBeInTheDocument();
    expect(screen.getByText('Declaração de Conclusão - Introdução à Programação')).toBeInTheDocument();
  });
  
  test('filters documents when tab is changed', async () => {
    render(<DocumentsPage />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText(/Documentos Acadêmicos/i)).toBeInTheDocument();
    });
    
    // Click on the "Declarações de Matrícula" tab
    fireEvent.click(screen.getByText('Declarações de Matrícula'));
    
    // Check if only enrollment declaration is displayed
    expect(screen.getByText('Declaração de Matrícula')).toBeInTheDocument();
    expect(screen.queryByText('Histórico de Notas')).not.toBeInTheDocument();
    
    // Click on the "Histórico de Notas" tab
    fireEvent.click(screen.getByText('Histórico de Notas'));
    
    // Check if only grade history is displayed
    expect(screen.queryByText('Declaração de Matrícula')).not.toBeInTheDocument();
    expect(screen.getByText('Histórico de Notas')).toBeInTheDocument();
  });
  
  test('handles document download', async () => {
    render(<DocumentsPage />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText(/Documentos Acadêmicos/i)).toBeInTheDocument();
    });
    
    // Find all download buttons
    const downloadButtons = screen.getAllByText('Download');
    
    // Click the first download button
    fireEvent.click(downloadButtons[0]);
    
    // Check if alert was called with the correct message
    expect(window.alert).toHaveBeenCalledWith('Download iniciado: Declaração de Matrícula');
  });
  
  test('handles document printing', async () => {
    render(<DocumentsPage />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText(/Documentos Acadêmicos/i)).toBeInTheDocument();
    });
    
    // Find all print buttons
    const printButtons = screen.getAllByText('Imprimir');
    
    // Click the first print button
    fireEvent.click(printButtons[0]);
    
    // Check if alert was called with the correct message
    expect(window.alert).toHaveBeenCalledWith('Preparando impressão: Declaração de Matrícula');
  });
  
  test('shows empty state when no documents are available', async () => {
    // Mock empty documents array
    (mockDataModule.getAcademicDocuments as jest.Mock).mockResolvedValue([]);
    
    render(<DocumentsPage />);
    
    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText(/Documentos Acadêmicos/i)).toBeInTheDocument();
    });
    
    // Check if empty state message is displayed
    expect(screen.getByText(/Nenhum documento disponível nesta categoria/i)).toBeInTheDocument();
  });
});
