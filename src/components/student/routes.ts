import { 
  BookOpen, Award, Bell, MessageSquare, User, 
  Settings, FileCheck, BookMarked, CreditCard, BarChart2,
  CreditCard as CardIcon, FileText
} from 'lucide-react';

export interface RouteItem {
  path: string;
  name: string;
  icon: any;
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
    icon: BarChart2,
  },
  {
    path: studentRoutes.profile,
    name: 'Perfil',
    icon: User,
  },
  {
    path: studentRoutes.courses,
    name: 'Cursos',
    icon: BookOpen,
  },
  {
    path: studentRoutes.learningPath,
    name: 'Rotas de Aprendizagem',
    icon: BookMarked,
  },
  {
    path: studentRoutes.credential,
    name: 'Credencial',
    icon: CardIcon,
  },
  {
    path: studentRoutes.documents,
    name: 'Documentos',
    icon: FileText,
  },
  // Removed duplicate entries for Credencial and Documentos
  {
    path: studentRoutes.certificates,
    name: 'Certificados',
    icon: Award,
  },
  {
    path: studentRoutes.grades,
    name: 'Notas',
    icon: FileCheck,
  },
  {
    path: studentRoutes.financial,
    name: 'Financeiro',
    icon: CreditCard,
  },
  {
    path: studentRoutes.notifications,
    name: 'Notificações',
    icon: Bell,
  },
  {
    path: studentRoutes.messages,
    name: 'Mensagens',
    icon: MessageSquare,
  },
  {
    path: studentRoutes.settings,
    name: 'Configurações',
    icon: Settings,
  },
];
