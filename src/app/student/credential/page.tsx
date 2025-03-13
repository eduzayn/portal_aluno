"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getStudentCredential, checkCredentialEligibility, upsertStudentCredential } from '../../../components/student/supabase-data';
import { StudentCredential } from '../../../components/student/types';
import { QRCodeSVG } from 'qrcode.react';
import { Camera, Download, Printer, RefreshCw, Upload } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { STORAGE_BUCKETS } from '../../../config/storage-buckets';
import { uploadFile, getPublicUrl } from '../../../utils/storage-utils';

export default function StudentCredentialPage() {
  const { user } = useAuth();
  const [credential, setCredential] = useState<StudentCredential | null>(null);
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const credentialRef = React.useRef<HTMLDivElement>(null);
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
    
    setGenerating(true);
    
    try {
      // Gerar código QR único
      const qrCodeData = `student-${user.id}-${Date.now()}`;
      
      // Criar nova credencial
      const newCredential = await upsertStudentCredential({
        studentId: user.id,
        photoUrl: photoUrl || user.avatar_url || '/images/avatars/avatar-1.png',
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      });
      
      setCredential(newCredential);
    } catch (error) {
      console.error('Erro ao gerar credencial:', error);
      setError('Não foi possível gerar sua credencial. Tente novamente mais tarde.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrintCredential = () => {
    window.print();
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
      setError('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
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
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `credential-${Date.now()}.png`, { type: 'image/png' });
            await uploadCredentialPhoto(file);
          }
        }, 'image/png');
        
        // Parar a câmera
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
          setCameraStream(null);
        }
        
        setShowCamera(false);
      }
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) {
      return;
    }
    
    const file = e.target.files[0];
    await uploadCredentialPhoto(file);
  };
  
  const uploadCredentialPhoto = async (file: File) => {
    if (!user) return;
    
    try {
      // Definir o caminho do arquivo no bucket
      const filePath = `credential-${user.id}/${Date.now()}-${file.name}`;
      
      // Fazer upload do arquivo para o bucket Avatars com validação
      const { data, error } = await uploadFile(
        STORAGE_BUCKETS.AVATARS, 
        filePath, 
        file,
        {
          allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          maxSizeInBytes: 5 * 1024 * 1024 // 5MB
        }
      );
      
      if (error) {
        throw error;
      }
      
      // Obter a URL pública do arquivo
      const publicUrl = getPublicUrl(STORAGE_BUCKETS.AVATARS, filePath);
      
      // Atualizar o estado local
      setPhotoUrl(publicUrl);
    } catch (error: any) {
      console.error('Erro ao fazer upload da foto:', error);
      setError(`Erro ao fazer upload da foto: ${error.message}`);
    }
  };

  const handleDownloadCredential = async () => {
    const credentialElement = document.getElementById('student-credential');
    if (!credentialElement) return;
    
    try {
      const canvas = await html2canvas(credentialElement, {
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
      pdf.save(`credencial-${user?.name ? user.name.replace(/\s+/g, '-').toLowerCase() : 'estudante'}.pdf`);
    } catch (error) {
      console.error('Erro ao baixar credencial:', error);
      setError('Não foi possível baixar sua credencial. Tente novamente mais tarde.');
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
            id="student-credential"
            className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md p-6 border-2 border-indigo-500 print:border-none"
          >
            <div className="flex flex-col items-center">
              <div className="mb-4 w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500">
                <Image 
                  src={credential.photoUrl || '/images/avatars/avatar-1.png'} 
                  alt="Foto do estudante" 
                  className="w-full h-full object-cover"
                  width={96}
                  height={96}
                />
              </div>
              
              <h2 className="text-xl font-bold text-center">{user?.name}</h2>
              <p className="text-gray-600 mb-2">{user?.email}</p>
              <p className="text-sm text-gray-500 mb-4">ID: {user?.id}</p>
              
              <div className="mb-4">
                <QRCodeSVG 
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
              onClick={handleDownloadCredential}
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
                    <Image 
                      src={photoUrl} 
                      alt="Foto para credencial" 
                      className="w-full h-full object-cover"
                      width={128}
                      height={128}
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
                    <div className="flex space-x-3">
                      <button
                        onClick={handleStartCamera}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Tirar Foto
                      </button>
                      
                      <input 
                        type="file" 
                        id="credential-photo" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                      />
                      <button
                        onClick={() => document.getElementById('credential-photo')?.click()}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Foto
                      </button>
                    </div>
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
              <button 
                onClick={() => router.push('/student/profile')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Completar Perfil
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
