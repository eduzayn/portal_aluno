"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface ValidationResult {
  valid: boolean;
  student?: {
    id: string;
    name: string;
    email: string;
  };
  issueDate?: string;
  expiryDate?: string;
  status?: string;
  message?: string;
}

export default function QRCodeValidationPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validateCredential() {
      if (!code) {
        setError('Código QR inválido ou ausente');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/credentials/validate?code=${code}`);
        const data = await response.json();
        
        setResult(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao validar credencial:', error);
        setError('Não foi possível validar a credencial. Tente novamente mais tarde.');
        setLoading(false);
      }
    }
    
    validateCredential();
  }, [code]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Validação Falhou</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Resultado Indisponível</h2>
            <p className="text-gray-600 mb-6">Não foi possível obter o resultado da validação.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
        <div className="text-center">
          {result.valid ? (
            <>
              <div className="bg-green-100 rounded-full p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Credencial Válida</h2>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-lg">{result.student?.name}</h3>
                <p className="text-gray-600 text-sm">{result.student?.email}</p>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Emitida em: {new Date(result.issueDate || '').toLocaleDateString('pt-BR')}
                  </p>
                  {result.expiryDate && (
                    <p className="text-sm text-gray-600">
                      Válida até: {new Date(result.expiryDate).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
              
              <p className="text-green-600 font-medium">
                Esta credencial é autêntica e está ativa.
              </p>
            </>
          ) : (
            <>
              <div className="bg-red-100 rounded-full p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Credencial Inválida</h2>
              <p className="text-red-600 font-medium mb-4">
                {result.message || 'Esta credencial não é válida.'}
              </p>
              {result.status === 'expired' && (
                <p className="text-gray-600">
                  A credencial expirou em {result.expiryDate ? new Date(result.expiryDate).toLocaleDateString('pt-BR') : 'data desconhecida'}.
                </p>
              )}
            </>
          )}
          
          <div className="mt-6">
            <a 
              href="/"
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity"
            >
              Voltar para o Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
