'use client';

import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { cn } from '../../lib/utils';

// Props do diálogo
export interface AccessibleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  id?: string;
  role?: 'dialog' | 'alertdialog';
}

// Componente de diálogo acessível
const AccessibleDialog = forwardRef<HTMLDivElement, AccessibleDialogProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      className,
      contentClassName,
      showCloseButton = true,
      closeOnEsc = true,
      closeOnOutsideClick = true,
      initialFocus,
      id,
      role = 'dialog',
    },
    ref
  ) => {
    const { highContrastMode, announceToScreenReader } = useAccessibility();
    const [isVisible, setIsVisible] = useState(false);
    const dialogRef = useRef<HTMLDivElement | null>(null);
    
    // ID do diálogo
    const dialogId = id || `dialog-${Math.random().toString(36).substring(2, 9)}`;
    const titleId = `${dialogId}-title`;
    const descriptionId = `${dialogId}-description`;
    
    // Função para focar elementos dentro do diálogo
    const focusFirstElement = () => {
      if (!dialogRef.current) return;
      
      // Se houver um elemento inicial para focar, use-o
      if (initialFocus?.current) {
        initialFocus.current.focus();
        return;
      }
      
      // Elementos focáveis
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      // Focar no primeiro elemento focável ou no diálogo
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      } else {
        dialogRef.current.focus();
      }
    };
    
    // Trap de foco
    const handleTabKey = (e: KeyboardEvent) => {
      if (!isOpen || e.key !== 'Tab' || !dialogRef.current) return;
      
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      // Se estiver pressionando Shift+Tab e estiver no primeiro elemento, vá para o último
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } 
      // Se estiver pressionando Tab e estiver no último elemento, vá para o primeiro
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    // Efeito para anunciar abertura/fechamento do diálogo
    useEffect(() => {
      if (isOpen) {
        // Pequeno atraso para garantir que o diálogo esteja visível antes de anunciar
        const timer = setTimeout(() => {
          setIsVisible(true);
          announceToScreenReader(`Diálogo aberto: ${title}`, 'assertive');
          
          // Focar no elemento inicial ou no primeiro elemento focável
          focusFirstElement();
        }, 10);
        
        return () => clearTimeout(timer);
      } else {
        setIsVisible(false);
        if (isVisible) {
          announceToScreenReader('Diálogo fechado', 'polite');
        }
      }
    }, [isOpen, title, announceToScreenReader, isVisible, initialFocus]);
    
    // Manipulador de teclas
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        // Fechar com Escape
        if (closeOnEsc && isOpen && event.key === 'Escape') {
          onClose();
        }
        
        // Trap de foco com Tab
        handleTabKey(event);
      };
      
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, closeOnEsc]);
    
    // Manipulador de clique fora do diálogo
    const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOutsideClick && event.target === event.currentTarget) {
        onClose();
      }
    };
    
    // Se o diálogo não estiver aberto, não renderizar nada
    if (!isOpen) {
      return null;
    }
    
    // Classes do overlay
    const overlayClasses = cn(
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
      'transition-opacity',
      isVisible ? 'opacity-100' : 'opacity-0',
      highContrastMode ? 'high-contrast-dialog-overlay' : '',
      className
    );
    
    // Classes do conteúdo
    const contentClasses = cn(
      'bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto',
      'transition-transform',
      isVisible ? 'scale-100' : 'scale-95',
      highContrastMode ? 'high-contrast-dialog-content' : '',
      contentClassName
    );
    
    // Função para combinar refs
    const combineRefs = (element: HTMLDivElement | null) => {
      // Salvar a referência interna
      if (dialogRef) {
        dialogRef.current = element;
      }
      
      // Passar a referência para a ref fornecida
      if (!ref) return;
      
      if (typeof ref === 'function') {
        ref(element);
      } else {
        ref.current = element;
      }
    };
    
    return (
      <div
        className={overlayClasses}
        onClick={handleOutsideClick}
        aria-hidden="true"
      >
        <div
          ref={combineRefs}
          role={role}
          id={dialogId}
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          aria-modal="true"
          className={contentClasses}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          <header className="mb-4">
            <div className="flex justify-between items-center">
              <h2
                id={titleId}
                className={cn(
                  'text-xl font-semibold',
                  highContrastMode ? 'high-contrast-dialog-title' : ''
                )}
              >
                {title}
              </h2>
              
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    'p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                    highContrastMode ? 'high-contrast-dialog-close' : ''
                  )}
                  aria-label="Fechar diálogo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
            
            {description && (
              <p
                id={descriptionId}
                className={cn(
                  'mt-2 text-sm text-gray-500',
                  highContrastMode ? 'high-contrast-dialog-description' : ''
                )}
              >
                {description}
              </p>
            )}
          </header>
          
          <div className="dialog-content">{children}</div>
        </div>
      </div>
    );
  }
);

AccessibleDialog.displayName = 'AccessibleDialog';

export default AccessibleDialog;
