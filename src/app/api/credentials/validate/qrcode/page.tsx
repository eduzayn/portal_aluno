"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Search } from 'lucide-react';

interface CredentialValidationResult {
  valid: boolean;
  credential?: {
    id: string;
    studentId: string;
    photoUrl: string;
    qrCodeData: string;
    issueDate: string;
    expiryDate: string;
    status: string;
    student?: {
      name: string;
      email: string;
    };
  };
  error?: string;
}

export default function QRCodeValidationPage() {
  const searchParams = useSearchParams();
  const [qrCode, setQrCode] = useState<string>(searchParams.get('code') || '');
  const [validationResult, setValidationResult] = useState<CredentialValidationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // If QR code is provided in URL, validate it automatically
    if (qrCode) {
      validateCredential();
    }
  }, []);
  
  const validateCredential = async () => {
    if (!qrCode) {
      setError('Por favor, insira um código QR para validar');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/credentials/validate?qrcode=${qrCode}`);
      
      if (response.ok) {
        const data = await response.json();
        setValidationResult(data);
      } else {
        const errorData = await response.json();
        setValidationResult({
          valid: false,
          error: errorData.error || 'Credencial inválida'
        });
      }
    } catch (error) {
      console.error('Erro ao validar credencial:', error);
      setError('Ocorreu um erro ao validar a credencial. Tente novamente.');
      setValidationResult(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateCredential();
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">Validação de Credencial</h1>
          <p className="mt-2 text-gray-600">
            Verifique a autenticidade de uma credencial de estudante
          </p>
        </div>
        
        {!validationResult && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="qrCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Código QR
                </label>
                <input
                  type="text"
                  id="qrCode"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Digite o código QR"
                  required
                />
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Validando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Validar Credencial
                  </>
                )}
              </button>
            </form>
          </div>
        )}
        
        {validationResult && (
          <div className={`bg-white p-6 rounded-lg shadow-md ${validationResult.valid ? 'border-green-200' : 'border-red-200'}`}>
            <div className="text-center mb-4">
              {validationResult.valid ? (
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
                  <h2 className="text-xl font-bold text-green-700">Credencial Válida</h2>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <XCircle className="h-16 w-16 text-red-500 mb-2" />
                  <h2 className="text-xl font-bold text-red-700">Credencial Inválida</h2>
                  <p className="mt-2 text-red-600">{validationResult.error}</p>
                </div>
              )}
            </div>
            
            {validationResult.valid && validationResult.credential && (
              <div className="mt-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500">
                    <img 
                      src={validationResult.credential.photoUrl || '/images/avatars/default.png'} 
                      alt="Foto do estudante" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nome do Estudante</h3>
                    <p className="text-lg font-semibold">{validationResult.credential.student?.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">ID da Credencial</h3>
                    <p className="text-lg font-semibold">{validationResult.credential.id}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Data de Emissão</h3>
                    <p className="text-lg font-semibold">
                      {new Date(validationResult.credential.issueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Data de Validade</h3>
                    <p className="text-lg font-semibold">
                      {new Date(validationResult.credential.expiryDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <button
                onClick={() => {
                  setValidationResult(null);
                  setQrCode('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Validar Outra Credencial
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
