'use client';

import React from 'react';
import { Bell, Calendar, MessageSquare, FileText } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'system' | 'course' | 'message' | 'document';
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      title: 'Nova mensagem do professor',
      message: 'Você recebeu uma nova mensagem do professor Carlos sobre o curso de Banco de Dados.',
      date: '2025-03-13T10:30:00',
      type: 'message',
      read: false,
    },
    {
      id: '2',
      title: 'Prazo de entrega atualizado',
      message: 'O prazo de entrega do trabalho de Estruturas de Dados foi estendido para 20/03/2025.',
      date: '2025-03-12T15:45:00',
      type: 'course',
      read: false,
    },
    {
      id: '3',
      title: 'Novo documento disponível',
      message: 'Seu certificado do curso de Desenvolvimento Web está disponível para download.',
      date: '2025-03-10T09:15:00',
      type: 'document',
      read: true,
    },
    {
      id: '4',
      title: 'Manutenção programada',
      message: 'O sistema estará indisponível para manutenção no dia 15/03/2025 das 23h às 01h.',
      date: '2025-03-08T14:20:00',
      type: 'system',
      read: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'course':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-purple-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
        <p className="text-gray-600">Gerencie suas notificações do sistema</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium">Todas as notificações</h2>
          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {notifications.filter((n) => !n.read).length} não lidas
          </span>
        </div>

        <div className="divide-y divide-gray-200">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-indigo-50' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  </div>
                  {!notification.read && (
                    <div className="ml-3 flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma notificação</h3>
              <p className="mt-1 text-sm text-gray-500">Você não tem notificações no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
