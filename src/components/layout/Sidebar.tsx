'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { colors } from '../../styles/colors';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { 
  Home, 
  Users, 
  FileText, 
  BarChart2, 
  Settings, 
  CreditCard, 
  GraduationCap,
  BookOpen,
  User
} from 'lucide-react';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('sidebar');
  
  // Module-specific configuration with translations
  const moduleConfig = {
    student: {
      name: 'Portal do Aluno',
      color: colors.primary.student,
      routes: [
        { path: '/dashboard', name: t('dashboard'), icon: <Home size={20} /> },
        { path: '/cursos', name: t('courses'), icon: <GraduationCap size={20} /> },
        { path: '/aulas', name: t('classes'), icon: <BookOpen size={20} /> },
        { path: '/notas', name: t('grades'), icon: <BarChart2 size={20} /> },
        { path: '/certificados', name: t('certificates'), icon: <FileText size={20} /> },
        { path: '/financeiro', name: t('financial'), icon: <CreditCard size={20} /> },
        { path: '/perfil', name: t('profile'), icon: <User size={20} /> },
      ],
    }
  };
  
  const config = moduleConfig.student;
  
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
            <h1 className="text-white font-bold text-xl">
              {isTablet ? 'PA' : 'Portal do Aluno'}
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
                    <span className="flex-shrink-0" style={pathname === route.path ? { color: config.color.main } : {}}>
                      {route.icon}
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
              <LanguageSwitcher />
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold">
                  A
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
