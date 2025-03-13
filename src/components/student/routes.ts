import React from 'react';

// Define simple icon components as React components
const BookOpen = () => React.createElement('span', { className: 'icon' }, 'B');
const Award = () => React.createElement('span', { className: 'icon' }, 'A');
const Bell = () => React.createElement('span', { className: 'icon' }, 'N');
const MessageSquare = () => React.createElement('span', { className: 'icon' }, 'M');
const User = () => React.createElement('span', { className: 'icon' }, 'U');
const Settings = () => React.createElement('span', { className: 'icon' }, 'S');
const FileCheck = () => React.createElement('span', { className: 'icon' }, 'F');
const BookMarked = () => React.createElement('span', { className: 'icon' }, 'BM');
const CreditCard = () => React.createElement('span', { className: 'icon' }, 'C');
const BarChart2 = () => React.createElement('span', { className: 'icon' }, 'BC');
const CardIcon = () => React.createElement('span', { className: 'icon' }, 'CI');
const FileText = () => React.createElement('span', { className: 'icon' }, 'FT');

export interface RouteItem {
  path: string;
  name: string;
  icon: React.ReactNode;
}

export interface StudentRoutes {
  dashboard: string;
  profile: string;
  courses: string;
  certificates: string;
  notifications: string;
  messages: string;
  settings: string;
  grades: string;
  help: string;
  financial: string;
  learningPath: string;
  credential: string;
  documents: string;
}

export const studentRoutes: StudentRoutes = {
  dashboard: '/student/dashboard',
  profile: '/student/profile',
  courses: '/student/courses',
  certificates: '/student/certificates',
  notifications: '/student/notifications',
  messages: '/student/messages',
  settings: '/student/settings',
  grades: '/student/grades',
  help: '/student/help',
  financial: '/student/financial',
  learningPath: '/student/learning-path',
  credential: '/student/credential',
  documents: '/student/documents',
};

export const studentNavItems: RouteItem[] = [
  {
    path: studentRoutes.dashboard,
    name: 'Dashboard',
    icon: React.createElement(BarChart2)
  },
  {
    path: studentRoutes.profile,
    name: 'Perfil',
    icon: React.createElement(User)
  },
  {
    path: studentRoutes.courses,
    name: 'Cursos',
    icon: React.createElement(BookOpen)
  },
  {
    path: studentRoutes.learningPath,
    name: 'Rotas de Aprendizagem',
    icon: React.createElement(BookMarked)
  },
  {
    path: studentRoutes.credential,
    name: 'Credencial',
    icon: React.createElement(CardIcon)
  },
  {
    path: studentRoutes.documents,
    name: 'Documentos',
    icon: React.createElement(FileText)
  },
  // Removed duplicate entries for Credencial and Documentos
  {
    path: studentRoutes.certificates,
    name: 'Certificados',
    icon: React.createElement(Award)
  },
  {
    path: studentRoutes.grades,
    name: 'Notas',
    icon: React.createElement(FileCheck)
  },
  {
    path: studentRoutes.financial,
    name: 'Financeiro',
    icon: React.createElement(CreditCard)
  },
  {
    path: studentRoutes.notifications,
    name: 'Notificações',
    icon: React.createElement(Bell)
  },
  {
    path: studentRoutes.messages,
    name: 'Mensagens',
    icon: React.createElement(MessageSquare)
  },
  {
    path: studentRoutes.settings,
    name: 'Configurações',
    icon: React.createElement(Settings)
  }
];
