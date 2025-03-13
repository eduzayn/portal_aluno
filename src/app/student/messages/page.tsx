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
  attachments?: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
  }[];
}

// Mock data function - would be replaced with actual API call
const getStudentMessages = async (userId: string): Promise<Message[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      senderId: 'inst-1',
      senderName: 'Prof. Carlos Mendes',
      senderRole: 'instructor',
      senderAvatar: '/images/avatars/instructor-1.png',
      recipientId: userId,
      subject: 'Feedback sobre seu projeto JavaScript',
      content: 'Olá! Acabei de revisar seu projeto de JavaScript e gostaria de compartilhar algumas observações. Seu código está bem estruturado, mas há algumas melhorias que podem ser feitas em relação à organização das funções. Vamos discutir isso na próxima aula?',
      date: '2025-03-12T14:30:00',
      read: false
    },
    {
      id: '2',
      senderId: 'admin-1',
      senderName: 'Secretaria Acadêmica',
      senderRole: 'admin',
      senderAvatar: '/images/avatars/admin-1.png',
      recipientId: userId,
      subject: 'Confirmação de matrícula',
      content: 'Prezado(a) aluno(a), sua matrícula para o próximo semestre foi confirmada com sucesso. Todos os documentos foram processados e validados. Caso tenha alguma dúvida, entre em contato com a secretaria acadêmica.',
      date: '2025-03-10T09:15:00',
      read: true
    },
    {
      id: '3',
      senderId: 'inst-2',
      senderName: 'Profa. Ana Souza',
      senderRole: 'instructor',
      senderAvatar: '/images/avatars/instructor-2.png',
      recipientId: userId,
      subject: 'Material adicional - React Hooks',
      content: 'Olá! Conforme solicitado na aula de hoje, estou enviando o material adicional sobre React Hooks. Também incluí alguns exercícios práticos que podem ajudar a fixar o conteúdo. Qualquer dúvida, estou à disposição.',
      date: '2025-03-08T16:45:00',
      read: false,
      attachments: [
        {
          id: 'att-1',
          name: 'react-hooks-material.pdf',
          url: '/files/react-hooks-material.pdf',
          size: 2048576, // 2MB
          type: 'application/pdf'
        },
        {
          id: 'att-2',
          name: 'exercicios-hooks.zip',
          url: '/files/exercicios-hooks.zip',
          size: 1048576, // 1MB
          type: 'application/zip'
        }
      ]
    },
    {
      id: '4',
      senderId: 'admin-2',
      senderName: 'Suporte Técnico',
      senderRole: 'admin',
      senderAvatar: '/images/avatars/admin-2.png',
      recipientId: userId,
      subject: 'Manutenção programada',
      content: 'Informamos que no próximo domingo, dia 20/03, o sistema ficará indisponível das 02:00 às 04:00 para manutenção programada. Pedimos desculpas pelo inconveniente.',
      date: '2025-03-05T11:20:00',
      read: true
    },
    {
      id: '5',
      senderId: 'inst-3',
      senderName: 'Prof. Roberto Alves',
      senderRole: 'instructor',
      senderAvatar: '/images/avatars/instructor-3.png',
      recipientId: userId,
      subject: 'Próxima aula - Node.js e Express',
      content: 'Olá! Na próxima aula, vamos iniciar o módulo de Node.js e Express. Por favor, prepare o ambiente de desenvolvimento conforme as instruções no link abaixo. Será importante ter tudo configurado para acompanhar os exercícios práticos.',
      date: '2025-03-03T13:10:00',
      read: true
    }
  ];
};

// Function to mark message as read
const markAsRead = async (messageId: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would update the database
  return true;
};

// Function to send a new message
const sendMessage = async (message: Partial<Message>): Promise<Message | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would save to the database
  return {
    id: `new-${Date.now()}`,
    senderId: message.senderId || '',
    senderName: message.senderName || '',
    senderRole: message.senderRole || 'student',
    senderAvatar: message.senderAvatar || '',
    recipientId: message.recipientId || '',
    subject: message.subject || '',
    content: message.content || '',
    date: new Date().toISOString(),
    read: false
  };
};

export default function MessagesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: '',
    recipientId: ''
  });

  useEffect(() => {
    async function loadMessages() {
      if (!user || !user.id) {
        // Mostrar estado de carregamento em vez de redirecionar imediatamente
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
    } else if (activeTab === 'sent') {
      // In a real app, this would filter messages sent by the user
      setFilteredMessages([]);
    }
  }, [activeTab, messages]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const success = await markAsRead(id);
      if (success) {
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, read: true } : msg
        ));
      }
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
    }
  };

  const handleReply = (message: Message) => {
    setReplyTo(message);
    setNewMessage({
      subject: `Re: ${message.subject}`,
      content: '',
      recipientId: message.senderId
    });
  };

  const handleSendMessage = async () => {
    if (!user || !newMessage.subject || !newMessage.content || !newMessage.recipientId) {
      return;
    }

    try {
      const sentMessage = await sendMessage({
        senderId: user.id,
        senderName: user.name || 'Aluno',
        senderRole: 'student',
        senderAvatar: '/images/avatars/default.png', // User profile doesn't have avatar property
        recipientId: newMessage.recipientId,
        subject: newMessage.subject,
        content: newMessage.content
      });

      if (sentMessage) {
        // Reset form
        setNewMessage({
          subject: '',
          content: '',
          recipientId: ''
        });
        setReplyTo(null);
        
        // Show success message or update UI
        alert('Mensagem enviada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Não foi possível enviar a mensagem. Tente novamente mais tarde.');
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
        <Badge variant="outline">{unreadCount} não lidas</Badge>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all" onClick={() => setActiveTab('all')}>Todas</TabsTrigger>
          <TabsTrigger value="unread" onClick={() => setActiveTab('unread')}>Não lidas</TabsTrigger>
          <TabsTrigger value="sent" onClick={() => setActiveTab('sent')}>Enviadas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {replyTo && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Responder: {replyTo.subject}</CardTitle>
                <CardDescription>Para: {replyTo.senderName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                    <input
                      type="text"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                    <textarea
                      value={newMessage.content}
                      onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md h-32"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setReplyTo(null)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      disabled={!newMessage.content}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="space-y-4">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma mensagem encontrada.</p>
              </div>
            ) : (
              filteredMessages.map(message => (
                <Card 
                  key={message.id} 
                  className={`${!message.read ? 'bg-gray-50 border-l-4 border-l-indigo-500' : ''}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex-shrink-0">
                          {message.senderAvatar ? (
                            <img 
                              src={message.senderAvatar} 
                              alt={message.senderName} 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              {message.senderName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{message.subject}</CardTitle>
                          <CardDescription className="text-sm">
                            De: {message.senderName} • {new Date(message.date).toLocaleString()}
                          </CardDescription>
                        </div>
                      </div>
                      {!message.read && (
                        <button 
                          onClick={() => handleMarkAsRead(message.id)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4 whitespace-pre-line">{message.content}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Anexos:</h4>
                        <div className="space-y-2">
                          {message.attachments.map(attachment => (
                            <div key={attachment.id} className="flex items-center p-2 bg-gray-50 rounded-md">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{attachment.name}</p>
                                <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(0)} KB</p>
                              </div>
                              <a 
                                href={attachment.url} 
                                download
                                className="text-indigo-600 hover:text-indigo-800 text-sm"
                              >
                                Baixar
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleReply(message)}
                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Responder
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
