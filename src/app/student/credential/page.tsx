"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { getStudentCredential, checkCredentialEligibility, upsertStudentCredential } from '../../../components/student/supabase-data';
import { StudentCredential } from '../../../components/student/types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CreditCard, Download, Printer, RefreshCw } from 'lucide-react';

export default function StudentCredentialPage() {
  const { user } = useAuth();
  const [credential, setCredential] = useState<StudentCredential | null>(null);
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);

  useEffect(() => {
    const fetchCredential = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Verificar se o aluno já possui uma credencial
        const existingCredential = await getStudentCredential(user.id);
        
        if (existingCredential) {
          setCredential(existingCredential);
        }
        
        // Verificar elegibilidade para credencial
        const eligible = await checkCredentialEligibility(user.id);
        setIsEligible(eligible);
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar credencial:', error);
        setError('Não foi possível carregar sua credencial. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchCredential();
  }, [user]);

  const handleGenerateCredential = async () => {
    if (!user) return;
    
    try {
      setGenerating(true);
      
      // Gerar QR code único
      const qrCodeData = `${user.id}-${Date.now()}`;
      
      // Criar ou atualizar credencial
      const newCredential = await upsertStudentCredential({
        studentId: user.id,
        photoUrl: user.avatar_url || '/images/default-avatar.png',
        qrCodeData,
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano
        status: 'active'
      });
      
      if (newCredential) {
        setCredential(newCredential);
      } else {
        setError('Não foi possível gerar sua credencial. Tente novamente mais tarde.');
      }
      
      setGenerating(false);
    } catch (error) {
      console.error('Erro ao gerar credencial:', error);
      setError('Não foi possível gerar sua credencial. Tente novamente mais tarde.');
      setGenerating(false);
    }
  };

  const handlePrintCredential = () => {
    const credentialElement = document.getElementById('credential-card');
    if (!credentialElement) return;
    
    window.print();
  };

  const handleDownloadCredential = async () => {
    const credentialElement = document.getElementById('credential-card');
    if (!credentialElement) return;
    
    try {
      const canvas = await html2canvas(credentialElement);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [85, 55] // Tamanho padrão de cartão
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, 85, 55);
      pdf.save('credencial-estudante.pdf');
    } catch (error) {
      console.error('Erro ao baixar credencial:', error);
      setError('Não foi possível baixar sua credencial. Tente novamente mais tarde.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-t-indigo-500 border-b-indigo-700 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Carregando credencial...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Credencial do Estudante</h1>
        <p className="text-gray-600">
          Sua credencial digital para acesso às instalações e serviços da instituição.
        </p>
      </div>

      {error && (
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {!credential && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <CreditCard className="w-6 h-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Solicitar Credencial</h2>
          </div>
          
          {isEligible ? (
            <>
              <p className="text-gray-600 mb-6">
                Você é elegível para solicitar sua credencial de estudante. Clique no botão abaixo para gerar sua credencial digital.
              </p>
              <button
                onClick={handleGenerateCredential}
                disabled={generating}
                className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-all disabled:opacity-70"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Gerar Credencial
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                <p className="text-amber-700">
                  <strong>Atenção:</strong> Para solicitar sua credencial, você precisa:
                </p>
                <ul className="list-disc ml-6 mt-2 text-amber-700">
                  <li>Ter seu perfil completo com foto</li>
                  <li>Ter pelo menos um pagamento realizado</li>
                </ul>
              </div>
              <button
                disabled
                className="flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Gerar Credencial
              </button>
            </>
          )}
        </div>
      )}

      {credential && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h2 className="text-xl font-semibold mb-4 md:mb-0">Sua Credencial Digital</h2>
            <div className="flex space-x-3">
              <button
                onClick={handlePrintCredential}
                className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </button>
              <button
                onClick={handleDownloadCredential}
                className="flex items-center px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar PDF
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div
              id="credential-card"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg overflow-hidden w-full max-w-sm"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-white text-xl font-bold">Edunéxia</h3>
                    <p className="text-indigo-100 text-sm">Credencial do Estudante</p>
                  </div>
                  <div className="bg-white p-2 rounded-md">
                    <QRCodeSVG value={credential.qrCodeData} size={80} />
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white mr-4">
                    <img
                      src={credential.photoUrl || '/images/default-avatar.png'}
                      alt="Foto do estudante"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{user?.name}</h4>
                    <p className="text-indigo-100 text-sm">{user?.email}</p>
                    <p className="text-indigo-100 text-xs">ID: {user?.id.substring(0, 8)}</p>
                  </div>
                </div>

                <div className="border-t border-indigo-400 pt-4">
                  <div className="flex justify-between text-xs text-indigo-100">
                    <div>
                      <p>Emissão:</p>
                      <p className="font-semibold">
                        {new Date(credential.issueDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p>Validade:</p>
                      <p className="font-semibold">
                        {new Date(credential.expiryDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p>Status:</p>
                      <p className="font-semibold uppercase">
                        {credential.status === 'active' ? 'Ativa' : 'Inativa'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-indigo-800 py-2 px-6">
                <p className="text-center text-indigo-100 text-xs">
                  Esta credencial é de uso pessoal e intransferível.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Informações Importantes</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mt-2 mr-2"></span>
            <span>Sua credencial tem validade de 1 ano a partir da data de emissão.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mt-2 mr-2"></span>
            <span>O QR code permite a validação da autenticidade da credencial.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mt-2 mr-2"></span>
            <span>Você pode imprimir sua credencial ou apresentá-la diretamente no seu dispositivo móvel.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mt-2 mr-2"></span>
            <span>Em caso de perda ou roubo, você pode gerar uma nova credencial, invalidando a anterior.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
