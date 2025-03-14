'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, CreditCard, FileText } from 'lucide-react';

export default function RestrictedAccessPage() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8 rounded-r-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-amber-500 mr-3 mt-0.5" />
            <div>
              <h2 className="text-xl font-bold text-amber-800 mb-2">Acesso Restrito</h2>
              <p className="text-amber-700 mb-4">
                Identificamos que há pagamentos em atraso há mais de 30 dias em sua conta. 
                Para sua conveniência, você ainda pode acessar informações financeiras e documentos, 
                mas o acesso ao conteúdo educacional está temporariamente restrito.
              </p>
              <p className="text-amber-700 font-medium">
                Regularize seus pagamentos para restaurar o acesso completo à plataforma.
              </p>
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-4">Áreas disponíveis:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div 
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/student/financial')}
          >
            <div className="flex items-center mb-4">
              <CreditCard className="h-6 w-6 text-emerald-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Área Financeira</h3>
            </div>
            <p className="text-gray-600">
              Acesse suas informações financeiras, histórico de pagamentos e opções para regularizar sua situação.
            </p>
          </div>
          
          <div 
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push('/student/documents')}
          >
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-orange-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Documentos</h3>
            </div>
            <p className="text-gray-600">
              Acesse seus documentos acadêmicos, declarações e outros documentos importantes.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => router.push('/student/financial')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ir para Área Financeira
          </button>
        </div>
      </div>
    </div>
  );
}
