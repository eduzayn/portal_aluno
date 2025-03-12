'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { cn } from '../../lib/utils';

// Item de navegação
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

// Props da navegação
export interface AccessibleNavigationProps extends HTMLAttributes<HTMLElement> {
  items: NavigationItem[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'tabs' | 'underline';
  ariaLabel?: string;
}

// Componente de navegação acessível
const AccessibleNavigation = forwardRef<HTMLElement, AccessibleNavigationProps>(
  (
    {
      className,
      items,
      orientation = 'horizontal',
      variant = 'default',
      ariaLabel = 'Navegação',
      ...props
    },
    ref
  ) => {
    const { highContrastMode } = useAccessibility();
    
    // Classes da navegação
    const navClasses = cn(
      'flex',
      orientation === 'horizontal' ? 'flex-row' : 'flex-col',
      variant === 'pills' ? 'space-x-2' : '',
      variant === 'tabs' ? 'border-b border-gray-200' : '',
      variant === 'underline' ? 'space-x-4' : '',
      highContrastMode ? 'high-contrast-nav' : '',
      className
    );
    
    // Classes dos itens
    const getItemClasses = (item: NavigationItem) => {
      const baseClasses = cn(
        'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
        item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        highContrastMode ? 'high-contrast-nav-item' : ''
      );
      
      switch (variant) {
        case 'pills':
          return cn(
            baseClasses,
            'px-3 py-2 rounded-md',
            item.active
              ? 'bg-primary-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          );
        case 'tabs':
          return cn(
            baseClasses,
            'px-4 py-2 border-b-2',
            item.active
              ? 'border-primary-500 text-primary-700'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          );
        case 'underline':
          return cn(
            baseClasses,
            'px-1 py-2 border-b-2',
            item.active
              ? 'border-primary-500 text-primary-700'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          );
        default:
          return cn(
            baseClasses,
            'px-3 py-2',
            item.active
              ? 'text-primary-700 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
          );
      }
    };
    
    return (
      <nav
        ref={ref}
        className={navClasses}
        aria-label={ariaLabel}
        {...props}
      >
        {items.map((item) => {
          const itemContent = (
            <>
              {item.icon && (
                <span className="mr-2" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {item.label}
            </>
          );
          
          return item.href ? (
            <a
              key={item.id}
              href={item.disabled ? undefined : item.href}
              className={getItemClasses(item)}
              aria-current={item.active ? 'page' : undefined}
              aria-disabled={item.disabled ? 'true' : 'false'}
              onClick={(e) => {
                if (item.disabled) {
                  e.preventDefault();
                  return;
                }
                item.onClick?.();
              }}
            >
              {itemContent}
            </a>
          ) : (
            <button
              key={item.id}
              type="button"
              className={getItemClasses(item)}
              aria-current={item.active ? 'page' : undefined}
              aria-disabled={item.disabled ? 'true' : 'false'}
              disabled={item.disabled}
              onClick={item.onClick}
            >
              {itemContent}
            </button>
          );
        })}
      </nav>
    );
  }
);

AccessibleNavigation.displayName = 'AccessibleNavigation';

export default AccessibleNavigation;
