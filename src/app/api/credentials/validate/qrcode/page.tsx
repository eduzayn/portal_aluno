"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ValidationResult {
  valid: boolean;
  student?: {
    name: string;
    email: string;
    issueDate: string;
    expiryDate: string;
  };
  message?: string;
  status?: string;
}

export default function QRCodeValidationPage() {
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Check if there's a code in the URL
  const code = searchParams.get('code');
  
  // Validate the QR code when the component mounts if code is present
  React.useEffect(() => {
    if (code) {
      validateQRCode(code);
    }
  }, [code]);
  
  const validateQRCode = async (qrCodeData: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/credentials/validate?code=${qrCodeData}`);
      const data = await response.json();
      
      setResult(data);
    } catch (error) {
      console.error('Error validating QR code:', error);
      setResult({
        valid: false,
        message: 'Erro ao validar o código QR'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleManualValidation = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const qrCodeData = formData.get('qrCode') as string;
    
    if (qrCodeData) {
      validateQRCode(qrCodeData);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">Validação de Credencial</h1>
        
        {!code && (
          <form onSubmit={handleManualValidation} className="space-y-4">
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
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Validando...' : 'Validar'}
            </button>
          </form>
        )}
        
        {loading && (
          <div className="text-center py-4">
            <p className="text-gray-600">Validando credencial...</p>
          </div>
        )}
        
        {result && !loading && (
          <div className={`mt-6 p-4 rounded-md ${result.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {result.valid ? (
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h2 className="text-lg font-medium text-green-800">Credencial Válida</h2>
                </div>
                
                <div className="pl-8 space-y-2">
                  <p className="text-sm text-gray-700"><span className="font-medium">Nome:</span> {result.student?.name}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">Email:</span> {result.student?.email}</p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Data de Emissão:</span>{' '}
                    {new Date(result.student?.issueDate || '').toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Validade:</span>{' '}
                    {new Date(result.student?.expiryDate || '').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-2">
                  <svg className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <h2 className="text-lg font-medium text-red-800">Credencial Inválida</h2>
                </div>
                <p className="text-sm text-red-700">{result.message}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Voltar para o Início
          </Link>
        </div>
      </div>
    </div>
  );
}
