"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string;
  read: boolean;
  link?: string;
  category: 'course' | 'financial' | 'system' | 'event';
}

// Mock data function - would be replaced with actual API call
const getStudentNotifications = async (userId: string): Promise<Notification[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      title: 'Nova aula disponível',
      message: 'A aula "Introdução ao React Hooks" foi adicionada ao seu curso de Desenvolvimento Web Fullstack.',
      type: 'info',
      date: '2025-03-12T10:30:00',
      read: false,
      link: '/student/courses',
      category: 'course'
    },
    {
      id: '2',
      title: 'Lembrete de pagamento',
      message: 'Sua próxima mensalidade vence em 3 dias. Evite juros realizando o pagamento até o vencimento.',
      type: 'warning',
      date: '2025-03-11T09:15:00',
      read: true,
      link: '/student/financial',
      category: 'financial'
    },
    {
      id: '3',
      title: 'Certificado emitido',
      message: 'Seu certificado para o curso "Fundamentos de JavaScript" foi emitido e já está disponível para download.',
      type: 'success',
      date: '2025-03-10T14:45:00',
      read: false,
      link: '/student/certificates',
      category: 'course'
    },
    {
      id: '4',
      title: 'Manutenção programada',
      message: 'O sistema ficará indisponível para manutenção no dia 20/03 das 02:00 às 04:00.',
      type: 'info',
      date: '2025-03-09T11:20:00',
      read: true,
      category: 'system'
    },
    {
      id: '5',
      title: 'Webinar: Carreira em Tecnologia',
      message: 'Participe do nosso webinar gratuito sobre oportunidades de carreira em tecnologia no dia 25/03 às 19:00.',
      type: 'info',
      date: '2025-03-08T16:30:00',
      read: false,
      link: 'https://eventos.edunexia.com/webinar-carreira-tech',
      category: 'event'
    },
    {
      id: '6',
      title: 'Feedback de atividade',
      message: 'Seu professor deixou um feedback para sua atividade "Projeto: App de Tarefas". Confira suas notas.',
      type: 'info',
      date: '2025-03-07T13:10:00',
      read: false,
      link: '/student/grades',
      category: 'course'
    },
    {
      id: '7',
      title: 'Problema no pagamento',
      message: 'Identificamos um problema no seu último pagamento. Por favor, entre em contato com o suporte financeiro.',
      type: 'error',
      date: '2025-03-06T10:45:00',
      read: true,
      link: '/student/financial',
      category: 'financial'
    }
  ];
};

// Function to mark notification as read
const markAsRead = async (notificationId: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, this would update the database
  return true;
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function loadNotifications() {
      if (!user || !user.id) {
        // Mostrar estado de carregamento em vez de redirecionar imediatamente
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
        const notifs = await getStudentNotifications(user.id);
        setNotifications(notifs);
        setFilteredNotifications(notifs);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
        setError('Não foi possível carregar suas notificações. Tente novamente mais tarde.');
        setLoading(false);
      }
    }
    
    loadNotifications();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredNotifications(notifications);
    } else if (activeTab === 'unread') {
      setFilteredNotifications(notifications.filter(notif => !notif.read));
    } else {
      setFilteredNotifications(notifications.filter(notif => notif.category === activeTab));
    }
  }, [activeTab, notifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const success = await markAsRead(id);
      if (success) {
        setNotifications(notifications.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        ));
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // In a real app, this would be a batch update
      const promises = notifications
        .filter(notif => !notif.read)
        .map(notif => markAsRead(notif.id));
      
      await Promise.all(promises);
      
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
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

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notificações</h1>
        <div className="flex items-center">
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-sm text-indigo-600 hover:text-indigo-800 mr-2"
            >
              Marcar todas como lidas
            </button>
          )}
          <Badge variant="outline">{unreadCount} não lidas</Badge>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all" onClick={() => setActiveTab('all')}>Todas</TabsTrigger>
          <TabsTrigger value="unread" onClick={() => setActiveTab('unread')}>Não lidas</TabsTrigger>
          <TabsTrigger value="course" onClick={() => setActiveTab('course')}>Cursos</TabsTrigger>
          <TabsTrigger value="financial" onClick={() => setActiveTab('financial')}>Financeiro</TabsTrigger>
          <TabsTrigger value="system" onClick={() => setActiveTab('system')}>Sistema</TabsTrigger>
          <TabsTrigger value="event" onClick={() => setActiveTab('event')}>Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma notificação encontrada.</p>
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <Card 
                  key={notification.id} 
                  className={`border-l-4 ${!notification.read ? 'bg-gray-50' : ''} ${getTypeStyles(notification.type)}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <span className="mr-2">{getTypeIcon(notification.type)}</span>
                        <CardTitle className="text-lg">{notification.title}</CardTitle>
                      </div>
                      {!notification.read && (
                        <button 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Marcar como lida
                        </button>
                      )}
                    </div>
                    <CardDescription className="text-xs">
                      {new Date(notification.date).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{notification.message}</p>
                    {notification.link && (
                      <a 
                        href={notification.link} 
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Ver detalhes →
                      </a>
                    )}
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
