"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAcademicDocuments } from '@/components/student/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Printer, AlertCircle } from 'lucide-react';

export default function DocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const loadDocuments = async () => {
      if (!user) return;
      
      try {
        const docs = await getAcademicDocuments(user.id);
        setDocuments(docs);
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
        setError('Erro ao carregar documentos');
      } finally {
        setLoading(false);
      }
    };
    
    loadDocuments();
  }, [user]);

  const filteredDocuments = activeTab === 'all' 
    ? documents 
    : documents.filter(doc => doc.documentType === activeTab);

  const handleDownload = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  const handlePrint = (fileUrl) => {
    window.open(`${fileUrl}?print=true`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" data-testid="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">Não foi possível carregar seus documentos. Por favor, tente novamente mais tarde.</p>
          </div>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">Documentos Acadêmicos</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhum documento disponível</h2>
          <p className="text-gray-600">
            Você ainda não possui documentos acadêmicos disponíveis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">Documentos Acadêmicos</h1>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="enrollment_declaration">Declaração de Matrícula</TabsTrigger>
          <TabsTrigger value="grade_history">Histórico de Notas</TabsTrigger>
          <TabsTrigger value="course_completion">Declaração de Conclusão</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{document.title}</h2>
                    <p className="text-sm text-gray-600">
                      Emitido em: {new Date(document.issueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(document.fileUrl)}
                      className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                    <button
                      onClick={() => handlePrint(document.fileUrl)}
                      className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      Imprimir
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {document.documentType === 'enrollment_declaration' && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Semestre</p>
                        <p className="text-gray-800">{document.metadata.semester}</p>
                      </div>
                    </>
                  )}
                  
                  {document.documentType === 'grade_history' && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Semestre</p>
                        <p className="text-gray-800">{document.metadata.semester}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Cursos</p>
                        <p className="text-gray-800">
                          {document.metadata.courses.join(', ')}
                        </p>
                      </div>
                    </>
                  )}
                  
                  {document.documentType === 'course_completion' && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Curso</p>
                        <p className="text-gray-800">{document.metadata.courseName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Data de Conclusão</p>
                        <p className="text-gray-800">
                          {new Date(document.metadata.completionDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nota Final</p>
                        <p className="text-gray-800">{document.metadata.grade}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
