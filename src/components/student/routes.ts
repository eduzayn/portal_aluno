import React from 'react';
import { 
  BookOpen, 
  Award, 
  Bell, 
  MessageSquare, 
  User, 
  Settings, 
  FileCheck, 
  BookMarked, 
  CreditCard, 
  BarChart2,
  Tag as CardIcon, 
  FileText 
} from 'lucide-react';

export interface RouteItem {
  path: string;
  name: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

export interface StudentRoutes {
  dashboard: string;
  profile: string;
  courses: string;
  certificates: string;
  notifications: string;
  messages: string;
  settings: string;
  userSettings: string;
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
  userSettings: '/student/user-settings',
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
    icon: React.createElement(BarChart2, { size: 20, className: "text-blue-500" })
  },
  {
    path: studentRoutes.profile,
    name: 'Perfil',
    icon: React.createElement(User, { size: 20, className: "text-pink-500" })
  },
  {
    path: studentRoutes.courses,
    name: 'Cursos',
    icon: React.createElement(BookOpen, { size: 20, className: "text-green-500" })
  },
  {
    path: studentRoutes.learningPath,
    name: 'Rotas de Aprendizagem',
    icon: React.createElement(BookMarked, { size: 20, className: "text-purple-500" })
  },
  {
    path: studentRoutes.credential,
    name: 'Credencial',
    icon: React.createElement(CardIcon, { size: 20, className: "text-rose-500" })
  },
  {
    path: studentRoutes.documents,
    name: 'Documentos',
    icon: React.createElement(FileText, { size: 20, className: "text-orange-500" })
  },
  // Removed duplicate entries for Credencial and Documentos
  {
    path: studentRoutes.certificates,
    name: 'Certificados',
    icon: React.createElement(Award, { size: 20, className: "text-indigo-500" })
  },
  {
    path: studentRoutes.grades,
    name: 'Notas',
    icon: React.createElement(FileCheck, { size: 20, className: "text-amber-500" })
  },
  {
    path: studentRoutes.financial,
    name: 'Financeiro',
    icon: React.createElement(CreditCard, { size: 20, className: "text-emerald-500" })
  },
  {
    path: studentRoutes.notifications,
    name: 'Notificações',
    icon: React.createElement(Bell, { size: 20, className: "text-violet-500" })
  },
  {
    path: studentRoutes.messages,
    name: 'Mensagens',
    icon: React.createElement(MessageSquare, { size: 20, className: "text-cyan-500" })
  },
  {
    path: studentRoutes.userSettings,
    name: 'Configurações da Conta',
    icon: React.createElement(Settings, { size: 20, className: "text-gray-500" })
  },
  {
    path: studentRoutes.settings,
    name: 'Configurações do Sistema',
    icon: React.createElement(Settings, { size: 20, className: "text-indigo-500" }),
    adminOnly: true
  }
];
