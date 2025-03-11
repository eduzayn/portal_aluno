'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { cn } from '../../lib/utils';

// Props do card
export interface AccessibleCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  hideTitle?: boolean;
  bordered?: boolean;
  elevated?: boolean;
  interactive?: boolean;
  fullWidth?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

// Componente de card acessível
const AccessibleCard = forwardRef<HTMLDivElement, AccessibleCardProps>(
  (
    {
      className,
      title,
      titleLevel = 2,
      hideTitle = false,
      bordered = true,
      elevated = false,
      interactive = false,
      fullWidth = false,
      padding = 'medium',
      children,
      ariaLabelledBy,
      ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const { highContrastMode } = useAccessibility();
    
    const cardId = props.id || `card-${Math.random().toString(36).substring(2, 9)}`;
    const titleId = `${cardId}-title`;
    
    // Classes do card
    const paddingClasses = {
      none: 'p-0',
      small: 'p-2',
      medium: 'p-4',
      large: 'p-6',
    };
    
    const cardClasses = cn(
      'rounded-lg',
      bordered ? 'border border-gray-200' : '',
      elevated ? 'shadow-md' : '',
      interactive ? 'hover:shadow-lg transition-shadow cursor-pointer' : '',
      paddingClasses[padding],
      fullWidth ? 'w-full' : '',
      highContrastMode ? 'high-contrast-card' : '',
      className
    );
    
    // Renderizar o título com o nível correto
    const TitleComponent = `h${titleLevel}` as keyof JSX.IntrinsicElements;
    
    return (
      <div
        ref={ref}
        id={cardId}
        className={cardClasses}
        aria-labelledby={ariaLabelledBy || (title && !hideTitle ? titleId : undefined)}
        aria-describedby={ariaDescribedBy}
        {...(interactive ? { tabIndex: 0, role: 'button' } : {})}
        {...props}
      >
        {title && !hideTitle && (
          <TitleComponent
            id={titleId}
            className={cn(
              'font-semibold',
              titleLevel === 1 ? 'text-2xl mb-4' : '',
              titleLevel === 2 ? 'text-xl mb-3' : '',
              titleLevel === 3 ? 'text-lg mb-2' : '',
              titleLevel >= 4 ? 'text-base mb-2' : '',
              highContrastMode ? 'high-contrast-heading' : ''
            )}
          >
            {title}
          </TitleComponent>
        )}
        {children}
      </div>
    );
  }
);

AccessibleCard.displayName = 'AccessibleCard';

export default AccessibleCard;
