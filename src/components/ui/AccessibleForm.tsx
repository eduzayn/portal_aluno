'use client';

import React, { forwardRef, FormHTMLAttributes, useState } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { cn } from '../../lib/utils';

// Props do formulário
export interface AccessibleFormProps extends FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
  successMessage?: string;
  errorMessage?: string;
  loading?: boolean;
  onValidationError?: (errors: Record<string, string>) => void;
  hideTitle?: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

// Componente de formulário acessível
const AccessibleForm = forwardRef<HTMLFormElement, AccessibleFormProps>(
  (
    {
      className,
      title,
      description,
      successMessage,
      errorMessage,
      loading = false,
      onValidationError,
      hideTitle = false,
      ariaLabelledBy,
      ariaDescribedBy,
      children,
      onSubmit,
      ...props
    },
    ref
  ) => {
    const { announceToScreenReader, highContrastMode } = useAccessibility();
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    
    const formId = props.id || `form-${Math.random().toString(36).substring(2, 9)}`;
    const titleId = `${formId}-title`;
    const descriptionId = `${formId}-description`;
    const statusId = `${formId}-status`;
    
    const hasErrors = Object.keys(validationErrors).length > 0 || !!errorMessage;
    
    // Classes do formulário
    const formClasses = cn(
      'space-y-4',
      highContrastMode ? 'high-contrast-form' : '',
      className
    );
    
    // Manipulador de envio do formulário
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      // Validar o formulário
      const form = event.currentTarget;
      const isValid = form.checkValidity();
      
      if (!isValid) {
        // Coletar erros de validação
        const errors: Record<string, string> = {};
        const formElements = Array.from(form.elements) as HTMLInputElement[];
        
        formElements.forEach((element) => {
          if (element.name && !element.validity.valid) {
            errors[element.name] = element.validationMessage;
          }
        });
        
        // Atualizar estado e anunciar erro
        setValidationErrors(errors);
        setFormState('error');
        announceToScreenReader('Formulário contém erros. Por favor, corrija os campos destacados.', 'assertive');
        
        // Chamar callback de erro de validação
        if (onValidationError) {
          onValidationError(errors);
        }
        
        return;
      }
      
      // Limpar erros de validação
      setValidationErrors({});
      
      // Atualizar estado para submitting
      setFormState('submitting');
      
      try {
        // Chamar o manipulador de envio original
        if (onSubmit) {
          await onSubmit(event);
        }
        
        // Atualizar estado para success
        setFormState('success');
        
        // Anunciar sucesso
        if (successMessage) {
          announceToScreenReader(successMessage, 'polite');
        } else {
          announceToScreenReader('Formulário enviado com sucesso.', 'polite');
        }
      } catch (error) {
        // Atualizar estado para error
        setFormState('error');
        
        // Anunciar erro
        if (errorMessage) {
          announceToScreenReader(errorMessage, 'assertive');
        } else {
          announceToScreenReader('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.', 'assertive');
        }
      }
    };
    
    return (
      <form
        ref={ref}
        className={formClasses}
        onSubmit={handleSubmit}
        aria-labelledby={ariaLabelledBy || (title && !hideTitle ? titleId : undefined)}
        aria-describedby={cn(
          ariaDescribedBy,
          description ? descriptionId : '',
          (formState === 'success' || formState === 'error') ? statusId : ''
        )}
        noValidate
        {...props}
      >
        {title && !hideTitle && (
          <h2 id={titleId} className={cn('text-xl font-semibold', highContrastMode ? 'high-contrast-heading' : '')}>
            {title}
          </h2>
        )}
        
        {description && (
          <p id={descriptionId} className={cn('text-sm text-gray-500', highContrastMode ? 'high-contrast-text' : '')}>
            {description}
          </p>
        )}
        
        {/* Conteúdo do formulário */}
        <div className="space-y-4">
          {children}
        </div>
        
        {/* Mensagens de status */}
        {formState === 'success' && successMessage && (
          <div
            id={statusId}
            className={cn('p-3 rounded-md bg-green-50 text-green-800', highContrastMode ? 'high-contrast-success' : '')}
            role="status"
          >
            {successMessage}
          </div>
        )}
        
        {formState === 'error' && errorMessage && (
          <div
            id={statusId}
            className={cn('p-3 rounded-md bg-red-50 text-red-800', highContrastMode ? 'high-contrast-error' : '')}
            role="alert"
          >
            {errorMessage}
          </div>
        )}
        
        {/* Anunciador de status para leitores de tela */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {formState === 'submitting' && 'Enviando formulário...'}
          {formState === 'success' && successMessage}
          {formState === 'error' && errorMessage}
        </div>
      </form>
    );
  }
);

AccessibleForm.displayName = 'AccessibleForm';

export default AccessibleForm;
