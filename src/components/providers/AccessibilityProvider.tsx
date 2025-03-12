'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { announceToScreenReader, isHighContrastPreferred, toggleHighContrastMode } from '../../lib/accessibility-utils';

// Tipo para o contexto de acessibilidade
type AccessibilityContextType = {
  highContrastMode: boolean;
  toggleHighContrastMode: () => void;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  focusableElements: HTMLElement[];
  registerFocusableElement: (element: HTMLElement) => void;
  unregisterFocusableElement: (element: HTMLElement) => void;
  reducedMotion: boolean;
};

// Criação do contexto
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Hook para usar o contexto de acessibilidade
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility deve ser usado dentro de um AccessibilityProvider');
  }
  return context;
};

// Props para o provider
interface AccessibilityProviderProps {
  children: ReactNode;
}

// Componente Provider
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  // Estados
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Função para alternar o modo de alto contraste
  const handleToggleHighContrastMode = () => {
    const newMode = !highContrastMode;
    setHighContrastMode(newMode);
    toggleHighContrastMode(newMode);
  };

  // Função para anunciar mensagens para leitores de tela
  const handleAnnounceToScreenReader = (
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ) => {
    announceToScreenReader(message, priority);
  };

  // Função para registrar elementos focáveis
  const registerFocusableElement = (element: HTMLElement) => {
    setFocusableElements((prev) => [...prev, element]);
  };

  // Função para remover elementos focáveis
  const unregisterFocusableElement = (element: HTMLElement) => {
    setFocusableElements((prev) => prev.filter((el) => el !== element));
  };

  // Efeito para verificar preferências do usuário ao carregar
  useEffect(() => {
    // Verificar preferência de alto contraste
    const preferHighContrast = isHighContrastPreferred();
    setHighContrastMode(preferHighContrast);
    
    if (preferHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }

    // Verificar preferência de movimento reduzido
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(reducedMotionQuery.matches);

    // Listener para mudanças na preferência de movimento reduzido
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  // Valor do contexto
  const contextValue: AccessibilityContextType = {
    highContrastMode,
    toggleHighContrastMode: handleToggleHighContrastMode,
    announceToScreenReader: handleAnnounceToScreenReader,
    focusableElements,
    registerFocusableElement,
    unregisterFocusableElement,
    reducedMotion,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {/* Skip navigation links */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Pular para o conteúdo principal
      </a>
      <a
        href="#navigation"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-48 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Pular para a navegação
      </a>
      <a
        href="#search"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-96 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Pular para a busca
      </a>

      {children}

      {/* Anunciador para leitores de tela - polite */}
      <div
        id="accessibility-announcer-polite"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />

      {/* Anunciador para leitores de tela - assertive */}
      <div
        id="accessibility-announcer-assertive"
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
      />
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;
