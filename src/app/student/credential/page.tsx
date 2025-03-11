"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStudentCredential, checkCredentialEligibility, upsertStudentCredential } from '@/components/student/mock-data';
import { StudentCredential } from '@/components/student/types';
import QRCode from 'qrcode.react';
import { Camera, Download, Printer, RefreshCw } from 'lucide-react';

export default function StudentCredentialPage() {
  const { user } = useAuth();
  const [credential, setCredential] = useState<StudentCredential | null>(null);
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const credentialRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCredential = async () => {
      if (user) {
        try {
          // Verificar se o aluno já tem uma credencial
          const existingCredential = await getStudentCredential(user.id);
          
          if (existingCredential) {
            setCredential(existingCredential);
          } else {
            // Verificar elegibilidade para emissão de credencial
            const eligible = await checkCredentialEligibility(user.id);
            setIsEligible(eligible);
          }
        } catch (error) {
          console.error('Erro ao buscar credencial:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCredential();
  }, [user]);

  const handleGenerateCredential = async () => {
    if (!user) return;
    
    setGenerating(true);
    
    try {
      // Gerar código QR único
      const qrCodeData = `student-${user.id}-${Date.now()}`;
      
      // Criar nova credencial
      const newCredential = await upsertStudentCredential({
        studentId: user.id,
        photoUrl: photoUrl || user.avatar_url || '/images/avatars/avatar-1.png',
        qrCodeData,
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      });
      
      setCredential(newCredential);
    } catch (error) {
      console.error('Erro ao gerar credencial:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
    }
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const photoDataUrl = canvas.toDataURL('image/png');
        setPhotoUrl(photoDataUrl);
        setShowCamera(false);
        
        // Parar a câmera
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
          setCameraStream(null);
        }
      }
    }
  };

  const handlePrintCredential = () => {
    if (credentialRef.current) {
      window.print();
    }
  };

  const handleDownloadPDF = async () => {
    if (credentialRef.current) {
      try {
        const { jsPDF } = await import('jspdf');
        const html2canvas = await import('html2canvas');
        
        const element = credentialRef.current;
        const canvas = await html2canvas.default(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: [85, 54] // Tamanho padrão de cartão de crédito
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, 85, 54);
        pdf.save('credencial-estudante.pdf');
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
      }
    }
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
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">Credencial do Estudante</h1>
      
      {credential ? (
        <div className="flex flex-col items-center">
          <div 
            ref={credentialRef}
            className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md p-6 border-2 border-indigo-500 print:border-none"
          >
            <div className="flex flex-col items-center">
              <div className="mb-4 w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500">
                <img 
                  src={credential.photoUrl || '/images/avatars/avatar-1.png'} 
                  alt="Foto do estudante" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h2 className="text-xl font-bold text-center">{user?.name}</h2>
              <p className="text-gray-600 mb-2">{user?.email}</p>
              <p className="text-sm text-gray-500 mb-4">ID: {user?.id}</p>
              
              <div className="mb-4">
                <QRCode 
                  value={credential.qrCodeData} 
                  size={128}
                  level="H"
                  includeMargin={true}
                />
              </div>
              
              <div className="text-center text-sm text-gray-600">
                <p>Emissão: {new Date(credential.issueDate).toLocaleDateString('pt-BR')}</p>
                <p>Validade: {new Date(credential.expiryDate).toLocaleDateString('pt-BR')}</p>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Para verificar a autenticidade desta credencial, escaneie o QR code ou acesse:
                </p>
                <a 
                  href={`/api/credentials/validate/qrcode?code=${credential.qrCodeData}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 hover:underline"
                >
                  {`${window.location.origin}/api/credentials/validate/qrcode?code=${credential.qrCodeData}`}
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex mt-6 space-x-4">
            <button
              onClick={handlePrintCredential}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </button>
            
            <button
              onClick={handleDownloadPDF}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {isEligible ? (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold mb-4">Gerar Credencial de Estudante</h2>
              <p className="text-gray-600 mb-6 text-center">
                Você é elegível para emitir sua credencial de estudante. Para continuar, tire uma foto ou faça upload de uma imagem.
              </p>
              
              {photoUrl ? (
                <div className="mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-500 mx-auto">
                    <img 
                      src={photoUrl} 
                      alt="Foto para credencial" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setPhotoUrl(null)}
                    className="mt-2 text-sm text-indigo-600 hover:underline"
                  >
                    Remover foto
                  </button>
                </div>
              ) : (
                <div className="mb-6">
                  {showCamera ? (
                    <div className="relative">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="rounded-lg border-2 border-indigo-500"
                        style={{ width: '320px', height: '240px' }}
                      />
                      <button
                        onClick={handleCapturePhoto}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 transition-colors"
                      >
                        <Camera className="w-6 h-6" />
                      </button>
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                  ) : (
                    <button
                      onClick={handleStartCamera}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Tirar Foto
                    </button>
                  )}
                </div>
              )}
              
              <button
                onClick={handleGenerateCredential}
                disabled={generating || !photoUrl}
                className={`flex items-center px-6 py-3 rounded-md transition-colors ${
                  photoUrl 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    Gerar Credencial
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4">Credencial não disponível</h2>
              <p className="text-gray-600 mb-6">
                Você ainda não é elegível para emitir sua credencial de estudante. 
                Para ser elegível, é necessário ter documentação completa e pelo menos um pagamento realizado.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
