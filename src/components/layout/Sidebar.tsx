'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { colors } from '../../components/providers/colors';
import { 
  Home, 
  Users, 
  FileText, 
  BarChart2, 
  Settings, 
  CreditCard, 
  GraduationCap,
  BookOpen,
  User,
  Tag,
  File,
  MessageSquare,
  Bell
} from 'lucide-react';

// Module-specific configuration
const moduleConfig = {
  communication: {
    name: 'Comunicação',
    color: colors.primary.communication,
    routes: [
      { path: '/comunicacao/dashboard', name: 'Dashboard', icon: <Home size={20} /> },
      { path: '/comunicacao/mensagens', name: 'Mensagens', icon: <FileText size={20} /> },
      { path: '/comunicacao/contatos', name: 'Contatos', icon: <Users size={20} /> },
      { path: '/comunicacao/templates', name: 'Templates', icon: <FileText size={20} /> },
      { path: '/comunicacao/relatorios', name: 'Relatórios', icon: <BarChart2 size={20} /> },
      { path: '/comunicacao/configuracoes', name: 'Configurações', icon: <Settings size={20} /> },
    ],
  },
  student: {
    name: 'Portal do Aluno',
    color: colors.primary.student,
    routes: [
      { path: '/aluno/dashboard', name: 'Dashboard', icon: <Home size={20} /> },
      { path: '/aluno/cursos', name: 'Meus Cursos', icon: <File size={20} /> },
      { path: '/aluno/aulas', name: 'Aulas', icon: <FileText size={20} /> },
      { path: '/aluno/notas', name: 'Notas', icon: <BarChart2 size={20} /> },
      { path: '/aluno/financeiro', name: 'Financeiro', icon: <CreditCard size={20} /> },
      { path: '/aluno/contratos', name: 'Meus Contratos', icon: <FileText size={20} /> },
      { path: '/aluno/perfil', name: 'Meu Perfil', icon: <Users size={20} /> },
    ],
  },
  content: {
    name: 'Conteúdo',
    color: colors.primary.content,
    routes: [
      { path: '/conteudo/dashboard', name: 'Dashboard', icon: <Home size={20} /> },
      { path: '/conteudo/cursos', name: 'Cursos', icon: <File size={20} /> },
      { path: '/conteudo/aulas', name: 'Aulas', icon: <FileText size={20} /> },
      { path: '/conteudo/materiais', name: 'Materiais', icon: <File size={20} /> },
      { path: '/conteudo/avaliacoes', name: 'Avaliações', icon: <BarChart2 size={20} /> },
      { path: '/conteudo/configuracoes', name: 'Configurações', icon: <Settings size={20} /> },
    ],
  },
  enrollment: {
    name: 'Matrículas',
    color: colors.primary.enrollment,
    routes: [
      { path: '/matricula/dashboard', name: 'Dashboard', icon: <Home size={20} /> },
      { path: '/matricula/alunos', name: 'Alunos', icon: <Users size={20} /> },
      { path: '/matricula/cursos', name: 'Cursos', icon: <File size={20} /> },
      { path: '/matricula/pagamentos', name: 'Pagamentos', icon: <CreditCard size={20} /> },
      { path: '/matricula/descontos', name: 'Descontos', icon: <Tag size={20} /> },
      { path: '/matricula/relatorios', name: 'Relatórios', icon: <BarChart2 size={20} /> },
      { path: '/matricula/configuracoes', name: 'Configurações', icon: <Settings size={20} /> },
    ],
  },
};

interface SidebarProps {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
  navItems?: Array<{
    path: string;
    name: string;
    icon: React.ReactNode;
    adminOnly?: boolean;
  }>;
}

export const Sidebar = ({ module = 'student', navItems }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const pathname = usePathname();
  
  // Translation function
  const getTranslation = (key: string) => {
    const translations: Record<string, string> = {
      dashboard: 'Dashboard',
      courses: 'Cursos',
      classes: 'Aulas',
      grades: 'Notas',
      certificates: 'Certificados',
      financial: 'Financeiro',
      profile: 'Perfil',
      language: 'Idioma',
      logout: 'Sair'
    };
    return translations[key] || key;
  };
  
  // Use translations
  const t = getTranslation;
  
  // Use translated routes if translations are available
  const studentRoutesWithTranslations = [
    { path: '/student/dashboard', name: t('dashboard'), icon: <Home size={20} className="text-blue-500" /> },
    { path: '/student/courses', name: t('courses'), icon: <BookOpen size={20} className="text-green-500" /> },
    { path: '/student/learning-path', name: t('classes'), icon: <GraduationCap size={20} className="text-purple-500" /> },
    { path: '/student/grades', name: t('grades'), icon: <BarChart2 size={20} className="text-amber-500" /> },
    { path: '/student/financial', name: t('financial'), icon: <CreditCard size={20} className="text-emerald-500" /> },
    { path: '/student/certificates', name: t('certificates'), icon: <FileText size={20} className="text-indigo-500" /> },
    { path: '/student/credential', name: 'Credencial', icon: <Tag size={20} className="text-rose-500" /> },
    { path: '/student/documents', name: 'Documentos', icon: <File size={20} className="text-orange-500" /> },
    { path: '/student/messages', name: 'Mensagens', icon: <MessageSquare size={20} className="text-cyan-500" /> },
    { path: '/student/notifications', name: 'Notificações', icon: <Bell size={20} className="text-violet-500" /> },
    { path: '/student/profile', name: t('profile'), icon: <User size={20} className="text-pink-500" /> },
    { path: '/student/user-settings', name: 'Configurações da Conta', icon: <Settings size={20} className="text-gray-500" /> },
    { path: '/student/settings', name: 'Configurações do Sistema', icon: <Settings size={20} className="text-indigo-500" />, adminOnly: true },
  ];
  
  // Get user role from localStorage
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for temporary user in localStorage
    const tempUserJson = localStorage.getItem('portal_aluno_temp_user');
    if (tempUserJson) {
      try {
        const tempUser = JSON.parse(tempUserJson);
        setUserRole(tempUser.role);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);
  
  // Filter routes based on user role
  const filteredRoutes = studentRoutesWithTranslations.filter(
    route => !route.adminOnly || userRole === 'admin'
  );
  
  // Override student routes with translated versions
  const updatedModuleConfig = {
    ...moduleConfig,
    student: {
      ...moduleConfig.student,
      routes: filteredRoutes
    }
  };
  
  const config = navItems ? { 
    name: module === 'student' ? 'Portal do Aluno' : updatedModuleConfig[module].name,
    color: updatedModuleConfig[module].color,
    routes: navItems
  } : updatedModuleConfig[module];
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      if (width >= 1024) {
        setIsOpen(true);
      } else if (!isMobile && !isTablet) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, isTablet]);
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-neutral-200 transition-all duration-300 z-40 ${
          isOpen 
            ? 'translate-x-0' 
            : '-translate-x-full md:translate-x-0'
        } ${
          isTablet
            ? 'w-16 hover:w-64'
            : 'w-64'
        }`}
        style={{ 
          borderTopColor: config.color.main,
          borderTopWidth: '3px',
        }}
      >
        {/* Sidebar content */}
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div 
            className="h-16 flex items-center justify-center border-b border-neutral-200"
            style={{ background: config.color.gradient }}
          >
            <h1 className="text-white font-bold text-xl flex items-center">
              <GraduationCap size={24} className="mr-2" />
              {isTablet ? '' : config.name}
            </h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {config.routes.map((route) => (
                <li key={route.path}>
                  <Link
                    href={route.path}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      pathname === route.path
                        ? `bg-neutral-100 text-neutral-900 font-medium`
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                    style={
                      pathname === route.path
                        ? { color: config.color.main }
                        : {}
                    }
                  >
                    <span className="flex-shrink-0">
                      {typeof route.icon === 'function' ? route.icon : route.icon}
                    </span>
                    <span className={`ml-3 ${isTablet ? 'opacity-0 group-hover:opacity-100' : ''}`}>
                      {route.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Language Switcher */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">{t('language')}</span>
              <span className="text-sm">PT-BR</span>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <User size={16} />
                </div>
                <div className={`${isTablet ? 'hidden' : 'block'}`}>
                  <p className="text-sm font-medium">Aluno</p>
                  <p className="text-xs text-neutral-500">aluno@edunexia.com.br</p>
                </div>
              </div>
              <button 
                className="text-sm text-neutral-500 hover:text-neutral-700"
                onClick={() => console.log('Logout clicked')}
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      )}
    </>
  );
};

export default Sidebar;
