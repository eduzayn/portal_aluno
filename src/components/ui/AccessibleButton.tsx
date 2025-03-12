'use client';

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { cn } from '../../lib/utils';

// Tipos de variantes de botão
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger' | 'success' | 'warning';

// Tipos de tamanhos de botão
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Props do botão
export interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaPressed?: boolean;
  ariaHasPopup?: boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';
}

// Estilos de variantes de botão
const buttonVariants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
  outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  link: 'bg-transparent text-primary-600 hover:underline focus:ring-primary-500 p-0',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400',
};

// Estilos de tamanhos de botão
const buttonSizes = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-5 py-2.5',
  xl: 'text-xl px-6 py-3',
};

// Componente de botão acessível
const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      loadingText,
      iconLeft,
      iconRight,
      children,
      disabled,
      ariaLabel,
      ariaDescribedBy,
      ariaControls,
      ariaExpanded,
      ariaPressed,
      ariaHasPopup,
      ...props
    },
    ref
  ) => {
    const { highContrastMode } = useAccessibility();
    const isDisabled = disabled || loading;
    const buttonText = loading && loadingText ? loadingText : children;

    // Classes do botão
    const buttonClasses = cn(
      'inline-flex items-center justify-center rounded-md font-medium transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      buttonVariants[variant],
      buttonSizes[size],
      fullWidth ? 'w-full' : '',
      highContrastMode ? 'high-contrast-button' : '',
      className
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isDisabled}
        aria-disabled={isDisabled ? 'true' : 'false'}
        aria-busy={loading ? 'true' : 'false'}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        aria-pressed={ariaPressed}
        aria-haspopup={ariaHasPopup}
        {...props}
      >
        {loading && (
          <span className="animate-spin mr-2" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </span>
        )}
        {!loading && iconLeft && <span className="mr-2" aria-hidden="true">{iconLeft}</span>}
        <span>{buttonText}</span>
        {!loading && iconRight && <span className="ml-2" aria-hidden="true">{iconRight}</span>}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;
