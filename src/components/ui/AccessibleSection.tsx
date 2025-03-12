'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { cn } from '../../lib/utils';

// Props da seção
export interface AccessibleSectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  hideTitle?: boolean;
  description?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

// Componente de seção acessível
const AccessibleSection = forwardRef<HTMLElement, AccessibleSectionProps>(
  (
    {
      className,
      title,
      titleLevel = 2,
      hideTitle = false,
      description,
      children,
      ariaLabelledBy,
      ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const { highContrastMode } = useAccessibility();
    
    const sectionId = props.id || `section-${Math.random().toString(36).substring(2, 9)}`;
    const titleId = `${sectionId}-title`;
    const descriptionId = `${sectionId}-description`;
    
    // Classes da seção
    const sectionClasses = cn(
      'my-6',
      highContrastMode ? 'high-contrast-section' : '',
      className
    );
    
    // Renderizar o título com o nível correto
    const TitleComponent = `h${titleLevel}` as keyof JSX.IntrinsicElements;
    
    return (
      <section
        ref={ref}
        id={sectionId}
        className={sectionClasses}
        aria-labelledby={ariaLabelledBy || (title && !hideTitle ? titleId : undefined)}
        aria-describedby={ariaDescribedBy || (description ? descriptionId : undefined)}
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
        
        {description && (
          <p
            id={descriptionId}
            className={cn(
              'text-gray-600 mb-4',
              highContrastMode ? 'high-contrast-text' : ''
            )}
          >
            {description}
          </p>
        )}
        
        {children}
      </section>
    );
  }
);

AccessibleSection.displayName = 'AccessibleSection';

export default AccessibleSection;
