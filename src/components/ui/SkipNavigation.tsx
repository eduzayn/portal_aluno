'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { useAccessibility } from '../providers/AccessibilityProvider';

interface SkipNavigationProps {
  className?: string;
  mainId?: string;
  label?: string;
}

/**
 * Componente para pular para o conteúdo principal
 * Útil para usuários de teclado e leitores de tela
 */
const SkipNavigation: React.FC<SkipNavigationProps> = ({
  className,
  mainId = 'main-content',
  label = 'Pular para o conteúdo principal',
}) => {
  const { highContrastMode } = useAccessibility();
  
  return (
    <a
      href={`#${mainId}`}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50',
        'focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
        highContrastMode ? 'focus:bg-black focus:text-white focus:border-2 focus:border-white' : '',
        className
      )}
    >
      {label}
    </a>
  );
};

export default SkipNavigation;
