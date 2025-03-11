"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getAcademicDocuments } from '../../../components/student/supabase-data';
import { AcademicDocument } from '../../../components/student/types';
import { useRouter } from 'next/navigation';

export default function AcademicDocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<AcademicDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    async function loadDocuments() {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        
        const docs = await getAcademicDocuments(user.id);
        setDocuments(docs);
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
        setError('Não foi possível carregar seus documentos. Tente novamente mais tarde.');
        setLoading(false);
      }
    }
    
    loadDocuments();
  }, [user, router]);

  const filteredDocuments = activeTab === 'all' 
    ? documents 
    : documents.filter(doc => doc.documentType === activeTab);

  const handlePrintDocument = (fileUrl: string) => {
    const printWindow = window.open(fileUrl, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };

  const handleDownloadDocument = (fileUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case 'grade_history':
        return 'Histórico de Notas';
      case 'enrollment_declaration':
        return 'Declaração de Matrícula';
      case 'course_completion':
        return 'Declaração de Conclusão';
      default:
        return 'Documento';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Documentos Acadêmicos</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="mb-6 border-b border-gray-200">
          <div className="flex flex-wrap -mb-px">
            <button
              className={`mr-2 py-2 px-4 font-medium text-sm ${
                activeTab === 'all'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('all')}
            >
              Todos
            </button>
            <button
              className={`mr-2 py-2 px-4 font-medium text-sm ${
                activeTab === 'grade_history'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('grade_history')}
            >
              Histórico de Notas
            </button>
            <button
              className={`mr-2 py-2 px-4 font-medium text-sm ${
                activeTab === 'enrollment_declaration'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('enrollment_declaration')}
            >
              Declaração de Matrícula
            </button>
            <button
              className={`mr-2 py-2 px-4 font-medium text-sm ${
                activeTab === 'course_completion'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('course_completion')}
            >
              Declaração de Conclusão
            </button>
          </div>
        </div>
          
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum documento encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-md text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-600">{getDocumentTypeName(doc.documentType)}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Emitido em: {new Date(doc.issueDate).toLocaleDateString('pt-BR')}
                      </p>
                      {doc.metadata?.courseName && (
                        <p className="text-sm text-gray-600 mt-1">
                          Curso: {doc.metadata.courseName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end space-x-2">
                  <button 
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 flex items-center"
                    onClick={() => handlePrintDocument(doc.fileUrl)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Imprimir
                  </button>
                  <button 
                    className="px-3 py-1 text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md hover:opacity-90 flex items-center"
                    onClick={() => handleDownloadDocument(doc.fileUrl, doc.title)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Baixar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
