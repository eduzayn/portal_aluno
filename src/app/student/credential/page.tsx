"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getStudentCredential, checkCredentialEligibility, upsertStudentCredential } from '../../../components/student/supabase-data';
import { StudentCredential } from '../../../components/student/types';
import { QRCodeSVG } from 'qrcode.react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function StudentCredentialPage() {
  const { user } = useAuth();
  const [credential, setCredential] = useState<StudentCredential | null>(null);
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadCredential() {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Verificar elegibilidade
        const eligible = await checkCredentialEligibility(user.id);
        setIsEligible(eligible);
        
        if (!eligible) {
          setLoading(false);
          return;
        }
        
        // Buscar credencial existente
        const existingCredential = await getStudentCredential(user.id);
        
        if (existingCredential) {
          setCredential(existingCredential);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar credencial:', error);
        setError('Não foi possível carregar sua credencial. Tente novamente mais tarde.');
        setLoading(false);
      }
    }
    
    loadCredential();
  }, [user, router]);

  const handleGenerateCredential = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const newCredential = await upsertStudentCredential({
        studentId: user.id,
        photoUrl: user.avatar_url || '/images/default-avatar.png',
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano
        status: 'active'
      });
      
      if (newCredential) {
        setCredential(newCredential);
      } else {
        setError('Não foi possível gerar sua credencial. Tente novamente mais tarde.');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao gerar credencial:', error);
      setError('Não foi possível gerar sua credencial. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const handlePrintCredential = () => {
    window.print();
  };

  const handleDownloadCredential = async () => {
    const credentialElement = document.getElementById('student-credential');
    if (!credentialElement) return;
    
    try {
      const canvas = await html2canvas(credentialElement, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calcular dimensões para centralizar na página
      const imgWidth = 210 - 40; // A4 width - margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
      pdf.save(`credencial-${user?.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Erro ao baixar credencial:', error);
      setError('Não foi possível baixar sua credencial. Tente novamente mais tarde.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isEligible) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Credencial do Estudante</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-800">
              Você ainda não está elegível para obter sua credencial de estudante.
            </p>
            <p className="text-yellow-700 mt-2">
              Para obter sua credencial, você precisa:
            </p>
            <ul className="list-disc list-inside mt-2 text-yellow-700">
              <li>Completar seu perfil com todas as informações necessárias</li>
              <li>Ter pelo menos um pagamento confirmado na plataforma</li>
            </ul>
          </div>
          <button 
            onClick={() => router.push('/student/profile')}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity"
          >
            Completar Perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Credencial do Estudante</h1>
          <div className="flex space-x-2">
            {credential && (
              <>
                <button 
                  onClick={handlePrintCredential}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Imprimir
                </button>
                <button 
                  onClick={handleDownloadCredential}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Baixar
                </button>
              </>
            )}
            {!credential && (
              <button 
                onClick={handleGenerateCredential}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                Gerar Credencial
              </button>
            )}
            {credential && (
              <button 
                onClick={handleGenerateCredential}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Atualizar
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {credential && (
          <div 
            id="student-credential"
            className="border border-gray-200 rounded-lg p-6 max-w-md mx-auto print:border-2 print:border-black"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-indigo-600">Edunéxia</h2>
                <p className="text-sm text-gray-500">Portal do Aluno</p>
              </div>
              <div className="w-24 h-24 relative bg-gray-200 rounded-md">
                {credential.photoUrl && (
                  <Image
                    src={credential.photoUrl}
                    alt="Foto do estudante"
                    fill
                    className="rounded-md object-cover"
                  />
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold">{user?.name}</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-600 mt-1">ID: {user?.id.substring(0, 8)}</p>
              <p className="text-sm text-gray-600">
                Válido até: {new Date(credential.expiryDate || '').toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            <div className="flex justify-center mb-4">
              <QRCodeSVG 
                value={credential.qrCodeData}
                size={150}
                level="H"
                includeMargin={true}
              />
            </div>
            
            <p className="text-xs text-center text-gray-500">
              Esta credencial é pessoal e intransferível.
              Escaneie o QR code para verificar a autenticidade.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
