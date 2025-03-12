'use client';

import React from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { cn } from '../../lib/utils';

interface HighContrastToggleProps {
  className?: string;
  label?: string;
  hideLabel?: boolean;
  id?: string;
}

/**
 * Componente para alternar o modo de alto contraste
 */
const HighContrastToggle: React.FC<HighContrastToggleProps> = ({
  className,
  label = 'Modo de alto contraste',
  hideLabel = false,
  id,
}) => {
  const { highContrastMode, toggleHighContrastMode } = useAccessibility();
  
  const toggleId = id || `high-contrast-toggle-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={cn('flex items-center', className)}>
      <label
        htmlFor={toggleId}
        className={cn(
          'text-sm font-medium mr-2',
          hideLabel ? 'sr-only' : ''
        )}
      >
        {label}
      </label>
      <button
        id={toggleId}
        type="button"
        onClick={() => toggleHighContrastMode()}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          highContrastMode ? 'bg-primary-600' : 'bg-gray-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
        )}
        role="switch"
        aria-checked={highContrastMode}
        aria-label={label}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            highContrastMode ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
};

export default HighContrastToggle;
