'use client';

import React, { forwardRef, SelectHTMLAttributes, useState, useEffect } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { cn } from '../../lib/utils';
import useKeyboardNavigation from '../../hooks/useKeyboardNavigation';

// Props do select
export interface AccessibleSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: { value: string; label: string }[];
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  hideLabel?: boolean;
  required?: boolean;
  id?: string;
  onChange?: (value: string) => void;
}

// Componente de select acessível
const AccessibleSelect = forwardRef<HTMLSelectElement, AccessibleSelectProps>(
  (
    {
      className,
      label,
      options,
      helperText,
      error,
      fullWidth = false,
      hideLabel = false,
      required = false,
      id,
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const { highContrastMode, announceToScreenReader } = useAccessibility();
    const [focused, setFocused] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>(value as string || '');
    
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
    const hasError = !!error;
    const describedBy = `${selectId}-helper ${hasError ? `${selectId}-error` : ''}`.trim();
    
    // Atualizar o valor selecionado quando o valor da prop mudar
    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value as string);
      }
    }, [value]);
    
    // Classes do container
    const containerClasses = cn(
      'flex flex-col',
      fullWidth ? 'w-full' : '',
      className
    );
    
    // Classes do select
    const selectClasses = cn(
      'px-3 py-2 rounded-md border transition-colors appearance-none',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      hasError
        ? 'border-red-500 focus:ring-red-500 text-red-900'
        : 'border-gray-300 focus:ring-primary-500',
      highContrastMode ? 'high-contrast-select' : '',
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
    
    // Manipulador de mudança
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;
      setSelectedValue(newValue);
      
      if (onChange) {
        onChange(newValue);
      }
      
      // Encontrar o texto da opção selecionada
      const selectedOption = options.find((option) => option.value === newValue);
      if (selectedOption) {
        announceToScreenReader(`Selecionado: ${selectedOption.label}`);
      }
    };
    
    // Navegação por teclado
    const { handleKeyDown } = useKeyboardNavigation({
      onArrowDown: (e) => {
        const select = e.currentTarget as HTMLSelectElement;
        const currentIndex = select.selectedIndex;
        if (currentIndex < options.length - 1) {
          select.selectedIndex = currentIndex + 1;
          const newValue = options[currentIndex + 1].value;
          setSelectedValue(newValue);
          if (onChange) {
            onChange(newValue);
          }
          announceToScreenReader(`Selecionado: ${options[currentIndex + 1].label}`);
        }
      },
      onArrowUp: (e) => {
        const select = e.currentTarget as HTMLSelectElement;
        const currentIndex = select.selectedIndex;
        if (currentIndex > 0) {
          select.selectedIndex = currentIndex - 1;
          const newValue = options[currentIndex - 1].value;
          setSelectedValue(newValue);
          if (onChange) {
            onChange(newValue);
          }
          announceToScreenReader(`Selecionado: ${options[currentIndex - 1].label}`);
        }
      },
      onHome: (e) => {
        const select = e.currentTarget as HTMLSelectElement;
        if (options.length > 0) {
          select.selectedIndex = 0;
          const newValue = options[0].value;
          setSelectedValue(newValue);
          if (onChange) {
            onChange(newValue);
          }
          announceToScreenReader(`Selecionado: ${options[0].label}`);
        }
      },
      onEnd: (e) => {
        const select = e.currentTarget as HTMLSelectElement;
        if (options.length > 0) {
          const lastIndex = options.length - 1;
          select.selectedIndex = lastIndex;
          const newValue = options[lastIndex].value;
          setSelectedValue(newValue);
          if (onChange) {
            onChange(newValue);
          }
          announceToScreenReader(`Selecionado: ${options[lastIndex].label}`);
        }
      },
      preventDefault: true,
    });
    
    return (
      <div className={containerClasses}>
        <label htmlFor={selectId} className={labelClasses}>
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={selectClasses}
            value={selectedValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
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
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {helperText && !hasError && (
          <div id={`${selectId}-helper`} className={helperTextClasses}>
            {helperText}
          </div>
        )}
        {hasError && (
          <div
            id={`${selectId}-error`}
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

AccessibleSelect.displayName = 'AccessibleSelect';

export default AccessibleSelect;
