"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getAcademicDocuments } from '../../../components/student/supabase-data';
import { AcademicDocument } from '../../../components/student/types';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

export default function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<AcademicDocument[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  const handleDownloadDocument = (fileUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintDocument = (fileUrl: string) => {
    const printWindow = window.open(fileUrl, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };

  const getDocumentTypeLabel = (type: string) => {
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Documentos Acadêmicos</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="grade_history">Histórico de Notas</TabsTrigger>
          <TabsTrigger value="enrollment_declaration">Declaração de Matrícula</TabsTrigger>
          <TabsTrigger value="course_completion">Declaração de Conclusão</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {filteredDocuments.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum documento encontrado</h3>
              <p className="text-gray-500">
                {activeTab === 'all' 
                  ? 'Você ainda não possui documentos acadêmicos disponíveis.' 
                  : `Você ainda não possui ${getDocumentTypeLabel(activeTab).toLowerCase()} disponível.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((document) => (
                <div key={document.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{document.title}</h3>
                        <p className="text-sm text-gray-500">{getDocumentTypeLabel(document.documentType)}</p>
                      </div>
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                        {new Date(document.issueDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {document.metadata?.courseName && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500">Curso</p>
                        <p className="font-medium">{document.metadata.courseName}</p>
                      </div>
                    )}
                    
                    {document.metadata?.grade !== undefined && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500">Nota Final</p>
                        <p className="font-medium">{document.metadata.grade}</p>
                      </div>
                    )}
                    
                    {document.metadata?.completionDate && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500">Data de Conclusão</p>
                        <p className="font-medium">{new Date(document.metadata.completionDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handlePrintDocument(document.fileUrl)}
                        className="text-indigo-600 border border-indigo-600 px-3 py-1 rounded-md hover:bg-indigo-50 transition-colors text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Imprimir
                      </button>
                      <button
                        onClick={() => handleDownloadDocument(document.fileUrl, document.title)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition-colors text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Baixar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
