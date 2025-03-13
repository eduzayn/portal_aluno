<<<<<<< HEAD
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAcademicDocuments } from '@/components/student/mock-data';
import { AcademicDocument } from '@/components/student/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Download, Printer, FileText, Calendar, Clock } from 'lucide-react';

export default function StudentDocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<AcademicDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    const fetchDocuments = async () => {
      if (user) {
        try {
          const docs = await getAcademicDocuments(user.id);
          setDocuments(docs);
        } catch (error) {
          console.error('Erro ao buscar documentos:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDocuments();
  }, [user]);

  const handleDownload = (fileUrl: string, title: string) => {
    // Em um ambiente real, isso seria um link para download do arquivo
    // Para o mock, apenas simular o download
    alert(`Download iniciado: ${title}`);
  };

  const handlePrint = (fileUrl: string, title: string) => {
    // Em um ambiente real, isso abriria o documento para impressão
    // Para o mock, apenas simular a impressão
    alert(`Preparando impressão: ${title}`);
  };

  const getDocumentsByType = (type: string) => {
    if (type === 'all') {
      return documents;
    }
    return documents.filter(doc => doc.documentType === type);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">Documentos Acadêmicos</h1>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            Todos
          </TabsTrigger>
          <TabsTrigger value="enrollment_declaration" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            Declarações de Matrícula
          </TabsTrigger>
          <TabsTrigger value="grade_history" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            Histórico de Notas
          </TabsTrigger>
          <TabsTrigger value="course_completion" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-700">
            Conclusão de Cursos
          </TabsTrigger>
        </TabsList>
        
        {['all', 'enrollment_declaration', 'grade_history', 'course_completion'].map(tabValue => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4">
            {getDocumentsByType(tabValue).length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">Nenhum documento disponível nesta categoria</p>
              </div>
            ) : (
              getDocumentsByType(tabValue).map(document => (
                <div key={document.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:border-indigo-300 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{document.title}</h3>
                      
                      <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Emitido em: {new Date(document.issueDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Horário: {new Date(document.issueDate).toLocaleTimeString('pt-BR')}</span>
                        </div>
                      </div>
                      
                      {document.metadata && (
                        <div className="mt-2 text-sm text-gray-600">
                          {document.documentType === 'enrollment_declaration' && (
                            <p>Semestre: {document.metadata.semester}</p>
                          )}
                          
                          {document.documentType === 'grade_history' && (
                            <p>Semestre: {document.metadata.semester}</p>
                          )}
                          
                          {document.documentType === 'course_completion' && (
                            <div>
                              <p>Curso: {document.metadata.courseName}</p>
                              <p>Conclusão: {document.metadata.completionDate}</p>
                              <p>Nota final: {document.metadata.grade}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex mt-4 md:mt-0 space-x-2">
                      <button
                        onClick={() => handleDownload(document.fileUrl || '', document.title)}
                        className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        <span className="text-sm">Download</span>
                      </button>
                      
                      <button
                        onClick={() => handlePrint(document.fileUrl || '', document.title)}
                        className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      >
                        <Printer className="w-4 h-4 mr-1" />
                        <span className="text-sm">Imprimir</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
||||||| 67926a0
=======
"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getAcademicDocuments } from '../../../components/student/supabase-data';
import { AcademicDocument } from '../../../components/student/types';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';

export default function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<AcademicDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<AcademicDocument[]>([]);
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
        setFilteredDocuments(docs);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
        setError('Não foi possível carregar seus documentos. Tente novamente mais tarde.');
        setLoading(false);
      }
    }
    
    loadDocuments();
  }, [user, router]);

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredDocuments(documents);
    } else {
      setFilteredDocuments(documents.filter(doc => doc.documentType === activeTab));
    }
  }, [activeTab, documents]);

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

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="grade_history">Histórico de Notas</TabsTrigger>
            <TabsTrigger value="enrollment_declaration">Declaração de Matrícula</TabsTrigger>
            <TabsTrigger value="course_completion">Declaração de Conclusão</TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {activeTab === 'all' 
                ? 'Você ainda não possui documentos acadêmicos.' 
                : `Você ainda não possui documentos do tipo ${getDocumentTypeLabel(activeTab)}.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{doc.title}</h3>
                    <p className="text-sm text-gray-500">{getDocumentTypeLabel(doc.documentType)}</p>
                  </div>
                  <div className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                    {new Date(doc.issueDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                {doc.metadata?.courseId && (
                  <p className="text-sm text-gray-600 mb-2">
                    Curso: {doc.metadata.courseName || 'Não especificado'}
                  </p>
                )}
                
                <div className="flex justify-end space-x-2 mt-4">
                  <button 
                    onClick={() => handlePrintDocument(doc.fileUrl)}
                    className="text-gray-600 hover:text-indigo-600 flex items-center text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Imprimir
                  </button>
                  <button 
                    onClick={() => handleDownloadDocument(doc.fileUrl, doc.title)}
                    className="text-gray-600 hover:text-indigo-600 flex items-center text-sm"
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
>>>>>>> origin/devin/1741716832-resolve-conflicts-pr9-new
