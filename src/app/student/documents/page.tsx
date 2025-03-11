"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAcademicDocuments } from '@/components/student/mock-data';
import { AcademicDocument } from '@/components/student/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
