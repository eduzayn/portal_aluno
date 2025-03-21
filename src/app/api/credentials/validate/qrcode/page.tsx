"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface ValidationResult {
  valid: boolean;
  student?: {
    id?: string;
    name: string;
    email: string;
    issueDate?: string;
    expiryDate?: string;
  };
  issueDate?: string;
  expiryDate?: string;
  status?: string;
  message?: string;
  error?: string;
}

// Loading component for Suspense fallback
function ValidationLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando validação de credencial...</p>
      </div>
    </div>
  );
}

// Form component for manual validation
function ManualValidationForm() {
  const handleManualValidation = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const qrCodeData = formData.get('qrCode') as string;
    
    if (qrCodeData) {
      window.location.href = `/api/credentials/validate/qrcode?code=${qrCodeData}`;
    }
  };

  return (
    <form onSubmit={handleManualValidation} className="mt-6 space-y-4">
      <div>
        <label htmlFor="qrCode" className="block text-sm font-medium text-gray-700 mb-1">
          Código QR
        </label>
        <input
          type="text"
          id="qrCode"
          name="qrCode"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Digite o código QR"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Validar
      </button>
    </form>
  );
}

// Main validation content component
function ValidationContent() {
  const searchParams = useSearchParams();
  const qrCode = searchParams.get('code');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validateQRCode() {
      if (!qrCode) {
        setError('Código QR inválido ou ausente');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/credentials/validate?code=${qrCode}`);
        const data = await response.json();
        
        setResult(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao validar QR code:', error);
        setError('Erro ao validar credencial. Tente novamente mais tarde.');
        setLoading(false);
      }
    }
    
    validateQRCode();
  }, [qrCode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validando credencial...</p>
        </div>
      </div>
    );
  }

  if (error || result?.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-red-600 mb-2">Validação Falhou</h1>
          <p className="text-gray-600">{error || result?.error}</p>
          
          {!qrCode && <ManualValidationForm />}
        </div>
      </div>
    );
  }

  if (!result?.valid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-yellow-600 mb-2">Credencial Inválida</h1>
          <p className="text-gray-600">{result?.message || 'Esta credencial não é válida.'}</p>
          {result?.status && (
            <p className="mt-2 text-sm text-gray-500">
              Status: <span className="font-medium">{result.status === 'expired' ? 'Expirada' : 'Revogada'}</span>
            </p>
          )}
          
          {!qrCode && <ManualValidationForm />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-green-600">Credencial Válida</h1>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Informações do Estudante</h2>
            <div className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
              Verificado
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="font-medium">{result.student?.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{result.student?.email}</p>
            </div>
            
            {result.student?.id && (
              <div>
                <p className="text-sm text-gray-500">ID do Estudante</p>
                <p className="font-medium">{result.student.id.substring(0, 8)}</p>
              </div>
            )}
            
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Data de Emissão</p>
                <p className="font-medium">
                  {(result.issueDate || result.student?.issueDate) ? 
                    new Date(result.issueDate || result.student?.issueDate || '').toLocaleDateString('pt-BR') : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Válido até</p>
                <p className="font-medium">
                  {(result.expiryDate || result.student?.expiryDate) ? 
                    new Date(result.expiryDate || result.student?.expiryDate || '').toLocaleDateString('pt-BR') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Esta verificação foi realizada em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
          </p>
          <div className="mt-4">
            <Image
              src="/images/edunexia-logo.png"
              alt="Edunéxia Logo"
              width={120}
              height={40}
              className="mx-auto"
            />
          </div>
          
          <div className="mt-6">
            <Link
              href="/"
              className="inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Voltar para o Início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function QRCodeValidationPage() {
  return (
    <Suspense fallback={<ValidationLoading />}>
      <ValidationContent />
    </Suspense>
  );
}
