'use client';

import React, { forwardRef, InputHTMLAttributes, useState } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { cn } from '../../lib/utils';

// Props do input
export interface AccessibleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  hideLabel?: boolean;
  required?: boolean;
  id?: string;
}

// Componente de input acessível
const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      fullWidth = false,
      startIcon,
      endIcon,
      hideLabel = false,
      required = false,
      id,
      ...props
    },
    ref
  ) => {
    const { highContrastMode } = useAccessibility();
    const [focused, setFocused] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const hasError = !!error;
    const describedBy = `${inputId}-helper ${hasError ? `${inputId}-error` : ''}`.trim();

    // Classes do container
    const containerClasses = cn(
      'flex flex-col',
      fullWidth ? 'w-full' : '',
      className
    );

    // Classes do input
    const inputClasses = cn(
      'px-3 py-2 rounded-md border transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      hasError
        ? 'border-red-500 focus:ring-red-500 text-red-900'
        : 'border-gray-300 focus:ring-primary-500',
      startIcon ? 'pl-10' : '',
      endIcon ? 'pr-10' : '',
      highContrastMode ? 'high-contrast-input' : '',
      fullWidth ? 'w-full' : ''
    );

    // Classes do label
    const labelClasses = cn(
      'text-sm font-medium mb-1',
      hasError ? 'text-red-500' : 'text-gray-700',
      hideLabel ? 'sr-only' : '',
      highContrastMode ? 'high-contrast-label' : ''
    );

    // Classes do texto de ajuda
    const helperTextClasses = cn(
      'text-xs mt-1',
      hasError ? 'text-red-500' : 'text-gray-500',
      highContrastMode ? 'high-contrast-helper-text' : ''
    );

    return (
      <div className={containerClasses}>
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={describedBy}
            aria-required={required ? 'true' : 'false'}
            required={required}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {endIcon}
            </div>
          )}
        </div>
        {helperText && !hasError && (
          <div id={`${inputId}-helper`} className={helperTextClasses}>
            {helperText}
          </div>
        )}
        {hasError && (
          <div
            id={`${inputId}-error`}
            className={cn(helperTextClasses, 'text-red-500')}
            role="alert"
          >
            {error}
          </div>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';

export default AccessibleInput;
