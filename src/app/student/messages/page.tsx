'use client';

import React, { useState } from 'react';
import { Search, Send, User, Users, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  senderRole: 'professor' | 'student' | 'admin';
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participant: string;
  participantRole: 'professor' | 'student' | 'admin';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      participant: 'Prof. Carlos Silva',
      participantRole: 'professor',
      lastMessage: 'Olá, você tem alguma dúvida sobre a aula de hoje?',
      lastMessageTime: '2025-03-13T10:30:00',
      unreadCount: 1,
      messages: [
        {
          id: '1-1',
          sender: 'Prof. Carlos Silva',
          senderRole: 'professor',
          content: 'Olá, você tem alguma dúvida sobre a aula de hoje?',
          timestamp: '2025-03-13T10:30:00',
          read: false,
        },
        {
          id: '1-2',
          sender: 'Você',
          senderRole: 'student',
          content: 'Olá professor, sim! Gostaria de saber mais sobre o projeto final.',
          timestamp: '2025-03-13T10:25:00',
          read: true,
        },
      ],
    },
    {
      id: '2',
      participant: 'Ana Souza',
      participantRole: 'student',
      lastMessage: 'Vamos estudar juntos para a prova de amanhã?',
      lastMessageTime: '2025-03-12T18:45:00',
      unreadCount: 0,
      messages: [
        {
          id: '2-1',
          sender: 'Ana Souza',
          senderRole: 'student',
          content: 'Vamos estudar juntos para a prova de amanhã?',
          timestamp: '2025-03-12T18:45:00',
          read: true,
        },
        {
          id: '2-2',
          sender: 'Você',
          senderRole: 'student',
          content: 'Claro! Que horas você prefere?',
          timestamp: '2025-03-12T18:40:00',
          read: true,
        },
      ],
    },
    {
      id: '3',
      participant: 'Secretaria Acadêmica',
      participantRole: 'admin',
      lastMessage: 'Informamos que o calendário acadêmico foi atualizado.',
      lastMessageTime: '2025-03-10T09:15:00',
      unreadCount: 0,
      messages: [
        {
          id: '3-1',
          sender: 'Secretaria Acadêmica',
          senderRole: 'admin',
          content: 'Informamos que o calendário acadêmico foi atualizado.',
          timestamp: '2025-03-10T09:15:00',
          read: true,
        },
      ],
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectConversation = (conversation: Conversation) => {
    // Mark all messages as read
    const updatedConversation = {
      ...conversation,
      unreadCount: 0,
      messages: conversation.messages.map(msg => ({
        ...msg,
        read: true
      }))
    };
    
    setSelectedConversation(updatedConversation);
    
    // Update the conversations list
    setConversations(
      conversations.map(conv => 
        conv.id === conversation.id ? updatedConversation : conv
      )
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: `${selectedConversation.id}-${selectedConversation.messages.length + 1}`,
      sender: 'Você',
      senderRole: 'student',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
    };

    const updatedConversation = {
      ...selectedConversation,
      lastMessage: newMessage,
      lastMessageTime: new Date().toISOString(),
      messages: [...selectedConversation.messages, newMsg],
    };

    setSelectedConversation(updatedConversation);
    setConversations(
      conversations.map(conv => 
        conv.id === selectedConversation.id ? updatedConversation : conv
      )
    );
    setNewMessage('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date);
    } else {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }).format(date);
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.participant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mensagens</h1>
        <p className="text-gray-600">Gerencie suas conversas</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden flex h-[calc(100vh-220px)]">
        {/* Lista de conversas */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Buscar conversas"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100%-56px)]">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
                    selectedConversation?.id === conversation.id ? 'bg-indigo-50' : ''
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {conversation.participantRole === 'professor' ? (
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                      ) : conversation.participantRole === 'admin' ? (
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-green-600" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium truncate ${
                          conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {conversation.participant}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(conversation.lastMessageTime)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="ml-2 flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-white text-xs">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Nenhuma conversa encontrada
              </div>
            )}
          </div>
        </div>

        {/* Área de mensagens */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            <div className="p-3 border-b border-gray-200 flex items-center">
              <div className="flex-shrink-0">
                {selectedConversation.participantRole === 'professor' ? (
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                ) : selectedConversation.participantRole === 'admin' ? (
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{selectedConversation.participant}</p>
                <p className="text-xs text-gray-500">
                  {selectedConversation.participantRole === 'professor'
                    ? 'Professor'
                    : selectedConversation.participantRole === 'admin'
                    ? 'Administrador'
                    : 'Estudante'}
                </p>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.sender === 'Você' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender !== 'Você' && (
                    <div className="flex-shrink-0 mr-3">
                      {message.senderRole === 'professor' ? (
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                      ) : message.senderRole === 'admin' ? (
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === 'Você'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 text-right ${
                        message.sender === 'Você' ? 'text-indigo-200' : 'text-gray-500'
                      }`}
                    >
                      {formatDate(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  className="bg-indigo-600 text-white rounded-r-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <MessageSquare className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma conversa selecionada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Selecione uma conversa para começar a enviar mensagens.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
