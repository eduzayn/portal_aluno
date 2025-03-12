'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook para capturar o foco dentro de um container
 * @param active Se o trap de foco está ativo
 * @param returnFocusOnDeactivate Se deve retornar o foco ao elemento anteriormente focado quando desativado
 * @returns Ref para anexar ao elemento container
 */
const useFocusTrap = (
  active: boolean = true,
  returnFocusOnDeactivate: boolean = true
) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Armazena o elemento atualmente focado
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Foca o container se ele não tiver elementos focáveis
    if (containerRef.current) {
      containerRef.current.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current || event.key !== 'Tab') return;

      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      // Se Shift+Tab no primeiro elemento, move para o último elemento
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
      // Se Tab no último elemento, move para o primeiro elemento
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Retorna o foco ao elemento anteriormente focado quando desativado
      if (returnFocusOnDeactivate && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, returnFocusOnDeactivate]);

  return containerRef;
};

export default useFocusTrap;
