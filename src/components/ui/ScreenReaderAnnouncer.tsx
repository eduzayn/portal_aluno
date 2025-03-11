'use client';

import React, { useEffect } from 'react';

interface ScreenReaderAnnouncerProps {
  message: string;
  assertive?: boolean;
  clearAfter?: number;
}

/**
 * Componente para anunciar mensagens para leitores de tela
 * @param message Mensagem a ser anunciada
 * @param assertive Se a mensagem deve ser anunciada de forma assertiva
 * @param clearAfter Tempo em ms para limpar a mensagem (opcional)
 */
const ScreenReaderAnnouncer: React.FC<ScreenReaderAnnouncerProps> = ({
  message,
  assertive = false,
  clearAfter,
}) => {
  useEffect(() => {
    if (!message) return;

    // Limpar a mensagem após o tempo especificado
    if (clearAfter && clearAfter > 0) {
      const timer = setTimeout(() => {
        const element = document.getElementById(
          assertive ? 'sr-announcer-assertive' : 'sr-announcer-polite'
        );
        if (element) {
          element.textContent = '';
        }
      }, clearAfter);

      return () => clearTimeout(timer);
    }
  }, [message, assertive, clearAfter]);

  if (!message) return null;

  return (
    <div
      id={assertive ? 'sr-announcer-assertive' : 'sr-announcer-polite'}
      className="sr-only"
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {message}
    </div>
  );
};

export default ScreenReaderAnnouncer;
