"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/Badge';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'instructor' | 'admin';
  senderAvatar: string;
  recipientId: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

// Mock data function - would be replaced with actual API call
const getStudentMessages = async (userId: string): Promise<Message[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      senderId: 'instructor-1',
      senderName: 'Prof. Carlos Silva',
      senderRole: 'instructor',
      senderAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      recipientId: userId,
      subject: 'Feedback sobre seu projeto final',
      content: 'Olá! Acabei de revisar seu projeto final e gostaria de compartilhar algumas observações. No geral, seu trabalho está muito bom, mas há alguns pontos que poderiam ser melhorados. Podemos agendar uma reunião para discutir em detalhes?',
      date: '2025-03-12T14:30:00',
      read: false
    },
    {
      id: '2',
      senderId: 'admin-1',
      senderName: 'Secretaria Acadêmica',
      senderRole: 'admin',
      senderAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      recipientId: userId,
      subject: 'Confirmação de matrícula',
      content: 'Informamos que sua matrícula para o próximo semestre foi confirmada com sucesso. Todos os documentos foram processados e validados. Caso tenha alguma dúvida, entre em contato com a secretaria acadêmica.',
      date: '2025-03-10T09:15:00',
      read: true
    },
    {
      id: '3',
      senderId: 'instructor-2',
      senderName: 'Profa. Ana Martins',
      senderRole: 'instructor',
      senderAvatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      recipientId: userId,
      subject: 'Material complementar',
      content: 'Compartilho com você alguns materiais complementares que podem ajudar na compreensão do conteúdo abordado na última aula. Estes recursos incluem artigos científicos e vídeos explicativos. Bons estudos!',
      date: '2025-03-08T16:45:00',
      read: true
    },
    {
      id: '4',
      senderId: 'instructor-3',
      senderName: 'Prof. Roberto Almeida',
      senderRole: 'instructor',
      senderAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      recipientId: userId,
      subject: 'Alteração na data da prova',
      content: 'Informo que a data da prova foi alterada do dia 20/03 para o dia 25/03 devido a ajustes no calendário acadêmico. Por favor, atualize sua agenda. Qualquer dúvida, estou à disposição.',
      date: '2025-03-07T11:20:00',
      read: false
    },
    {
      id: '5',
      senderId: 'admin-2',
      senderName: 'Suporte Técnico',
      senderRole: 'admin',
      senderAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      recipientId: userId,
      subject: 'Manutenção programada',
      content: 'Informamos que haverá uma manutenção programada no sistema no próximo domingo, das 00h às 04h. Durante este período, o portal estará indisponível. Pedimos desculpas pelo inconveniente.',
      date: '2025-03-05T13:30:00',
      read: true
    }
  ];
};

// Function to mark message as read
const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would update the database
  return true;
};

export default function MessagesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    async function loadMessages() {
      if (!user || !user.id) {
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
        const msgs = await getStudentMessages(user.id);
        setMessages(msgs);
        setFilteredMessages(msgs);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
        setError('Não foi possível carregar suas mensagens. Tente novamente mais tarde.');
        setLoading(false);
      }
    }
    
    loadMessages();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredMessages(messages);
    } else if (activeTab === 'unread') {
      setFilteredMessages(messages.filter(msg => !msg.read));
    } else if (activeTab === 'read') {
      setFilteredMessages(messages.filter(msg => msg.read));
    }
  }, [activeTab, messages]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const success = await markMessageAsRead(id);
      if (success) {
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, read: true } : msg
        ));
        
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage({ ...selectedMessage, read: true });
        }
      }
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
    }
  };

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      handleMarkAsRead(message.id);
    }
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'bg-blue-100 text-blue-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'Professor';
      case 'admin':
        return 'Administrador';
      default:
        return 'Estudante';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Erro</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mensagens</h1>
        {!selectedMessage && (
          <Badge variant="outline">{unreadCount} não lidas</Badge>
        )}
      </div>
      
      {selectedMessage ? (
        <div>
          <button 
            onClick={handleBackToList}
            className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para lista
          </button>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{selectedMessage.subject}</CardTitle>
                  <CardDescription className="mt-1">
                    <div className="flex items-center">
                      <img 
                        src={selectedMessage.senderAvatar} 
                        alt={selectedMessage.senderName} 
                        className="h-6 w-6 rounded-full mr-2"
                      />
                      <span className="font-medium">{selectedMessage.senderName}</span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getRoleColor(selectedMessage.senderRole)}`}>
                        {getRoleName(selectedMessage.senderRole)}
                      </span>
                    </div>
                    <div className="text-xs mt-1">
                      {new Date(selectedMessage.date).toLocaleString()}
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{selectedMessage.content}</p>
              </div>
              
              <div className="mt-8 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-2">Responder</h3>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Escreva sua resposta aqui..."
                ></textarea>
                <div className="mt-2 flex justify-end">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Enviar resposta
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all" onClick={() => setActiveTab('all')}>Todas</TabsTrigger>
              <TabsTrigger value="unread" onClick={() => setActiveTab('unread')}>Não lidas</TabsTrigger>
              <TabsTrigger value="read" onClick={() => setActiveTab('read')}>Lidas</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="space-y-4">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma mensagem encontrada.</p>
                  </div>
                ) : (
                  filteredMessages.map(message => (
                    <Card 
                      key={message.id} 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${!message.read ? 'bg-gray-50 border-l-4 border-l-indigo-500' : ''}`}
                      onClick={() => handleSelectMessage(message)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className={`text-lg ${!message.read ? 'font-bold' : ''}`}>{message.subject}</CardTitle>
                            <CardDescription className="mt-1">
                              <div className="flex items-center">
                                <img 
                                  src={message.senderAvatar} 
                                  alt={message.senderName} 
                                  className="h-6 w-6 rounded-full mr-2"
                                />
                                <span className="font-medium">{message.senderName}</span>
                                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getRoleColor(message.senderRole)}`}>
                                  {getRoleName(message.senderRole)}
                                </span>
                              </div>
                            </CardDescription>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(message.date).toLocaleString()}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
