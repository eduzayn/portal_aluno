"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStudentCredential, checkCredentialEligibility, upsertStudentCredential } from '@/components/student/mock-data';
import { QRCodeSVG } from 'qrcode.react';
import { AlertCircle, CheckCircle, Download, RefreshCw } from 'lucide-react';

export default function StudentCredentialPage() {
  const { user } = useAuth();
  const [credential, setCredential] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEligible, setIsEligible] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const loadCredential = async () => {
      if (!user) return;
      
      try {
        const studentCredential = await getStudentCredential(user.id);
        
        if (studentCredential) {
          setCredential(studentCredential);
        } else {
          // Check if student is eligible for credential
          const eligible = await checkCredentialEligibility(user.id);
          setIsEligible(eligible);
        }
      } catch (error) {
        console.error('Erro ao carregar credencial:', error);
        setError('Não foi possível carregar sua credencial');
      } finally {
        setLoading(false);
      }
    };
    
    loadCredential();
  }, [user]);

  const generateCredential = async () => {
    if (!user) return;
    
    try {
      setGenerating(true);
      
      // Generate a random QR code data
      const qrCodeData = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      // Set expiry date to 1 year from now
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      
      const newCredential = await upsertStudentCredential({
        studentId: user.id,
        photoUrl: user.avatar_url || '/images/avatars/default.png',
        qrCodeData,
        issueDate: new Date().toISOString(),
        expiryDate: expiryDate.toISOString(),
        status: 'active'
      });
      
      setCredential(newCredential);
    } catch (error) {
      console.error('Erro ao gerar credencial:', error);
      setError('Não foi possível gerar sua credencial');
    } finally {
      setGenerating(false);
    }
  };

  const downloadCredential = () => {
    // In a real implementation, this would generate a PDF or image
    alert('Funcionalidade de download será implementada em breve');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" data-testid="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">Credencial do Estudante</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {credential ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500">
                  <img 
                    src={credential.photoUrl || '/images/avatars/default.png'} 
                    alt="Foto do estudante" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/3 text-center mb-6 md:mb-0">
                <h2 className="text-xl font-bold mb-2">{user?.name}</h2>
                <p className="text-gray-600 mb-1">ID: {user?.id}</p>
                <p className="text-gray-600 mb-4">Matrícula: {user?.id}</p>
                
                <div className="bg-green-50 inline-flex items-center px-3 py-1 rounded-full text-sm text-green-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Válida até {new Date(credential.expiryDate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <QRCodeSVG 
                    value={`${window.location.origin}/api/credentials/validate/qrcode?code=${credential.qrCodeData}`}
                    size={128}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={downloadCredential}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors mr-4"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      ) : isEligible ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-green-700 mb-4">Você é elegível para obter sua credencial</h2>
            <p className="text-gray-600 mb-6">
              Você completou os requisitos necessários para obter sua credencial de estudante.
              Clique no botão abaixo para gerar sua credencial digital.
            </p>
            
            <button
              onClick={generateCredential}
              disabled={generating}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors mx-auto"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Gerar Credencial
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-amber-700 mb-4">Você ainda não é elegível para uma credencial</h2>
            <p className="text-gray-600 mb-6">
              Para obter sua credencial de estudante, você precisa:
            </p>
            
            <ul className="text-left max-w-md mx-auto mb-6 space-y-2">
              <li className="flex items-start">
                <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">1</span>
                <span>Completar pelo menos um curso</span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">2</span>
                <span>Ter pelo menos um pagamento confirmado</span>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">3</span>
                <span>Completar seu perfil com foto e informações pessoais</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
