import { 
  BookOpen, Award, Bell, MessageSquare, User, 
  Settings, FileCheck, BookMarked, CreditCard, BarChart2 
} from 'lucide-react';

export interface RouteItem {
  path: string;
  name: string;
  icon: any;
}

export interface StudentRoutes {
  dashboard: string;
  courses: string;
  certificates: string;
  grades: string;
  exercises: string;
  materials: string;
  messages: string;
  notifications: string;
  profile: string;
  settings: string;
  help: string;
  financial: string;
  learningPath: string;
}

export const studentRoutes: StudentRoutes = {
  dashboard: '/student/dashboard',
  courses: '/student/courses',
  certificates: '/student/certificates',
  grades: '/student/grades',
  exercises: '/student/exercises',
  materials: '/student/materials',
  messages: '/student/messages',
  notifications: '/student/notifications',
  profile: '/student/profile',
  settings: '/student/settings',
  help: '/student/help',
  financial: '/student/financial',
  learningPath: '/student/learning-path',
};

export const studentNavItems: RouteItem[] = [
  {
    path: studentRoutes.dashboard,
    name: 'Dashboard',
    icon: BarChart2,
  },
  {
    path: studentRoutes.courses,
    name: 'Meus Cursos',
    icon: BookOpen,
  },
  {
    path: studentRoutes.learningPath,
    name: 'Rota de Aprendizagem',
    icon: BookMarked,
  },
  {
    path: studentRoutes.materials,
    name: 'Material Didático',
    icon: BookMarked,
  },
  {
    path: studentRoutes.certificates,
    name: 'Certificados',
    icon: Award,
  },
  {
    path: studentRoutes.notifications,
    name: 'Notificações',
    icon: Bell,
  },
  {
    path: studentRoutes.financial,
    name: 'Financeiro',
    icon: CreditCard,
  },
  {
    path: studentRoutes.profile,
    name: 'Perfil',
    icon: User,
  },
];
