"use client";

import React, { useState, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import { STORAGE_BUCKETS } from '../../../config/storage-buckets';
import { uploadFile, getPublicUrl } from '../../../utils/storage-utils';
import { uploadUserAvatar } from '../../../utils/profile-utils';
import { Camera, Upload, User } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url || null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    await uploadAvatar(file);
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
      setMessage({ type: 'error', text: 'Não foi possível acessar a câmera.' });
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
            const file = new File([blob], `avatar-${Date.now()}.png`, { type: 'image/png' });
            await uploadAvatar(file);
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

  const uploadAvatar = async (file: File) => {
    if (!user) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      // Use the utility function to upload avatar and update profile
      const { success, error } = await uploadUserAvatar(user.id, file);
      
      if (!success) {
        throw new Error(error);
      }
      
      // Refresh user data in the auth context
      await refreshUserData();
      
      // Update local state with the new avatar URL
      setAvatarUrl(user.avatar_url || null);
      setMessage({ type: 'success', text: 'Avatar atualizado com sucesso!' });
    } catch (error: any) {
      console.error('Erro ao fazer upload do avatar:', error);
      setMessage({ type: 'error', text: `Erro ao atualizar avatar: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">Perfil do Estudante</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-xl font-bold mb-4">Atualizar Avatar</h2>
          
          <div className="mb-6">
            {avatarUrl ? (
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-500 mx-auto">
                <img 
                  src={avatarUrl} 
                  alt="Avatar do usuário" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-indigo-500 mx-auto">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
          
          {showCamera ? (
            <div className="relative mb-4">
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
            <div className="flex space-x-4 mb-4">
              <button
                onClick={handleStartCamera}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                disabled={loading}
              >
                <Camera className="w-4 h-4 mr-2" />
                Tirar Foto
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                disabled={loading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}
          
          {loading && (
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
              <span className="ml-2 text-gray-600">Processando...</span>
            </div>
          )}
          
          {message && (
            <div className={`p-3 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Informações do Perfil</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Nome:</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
