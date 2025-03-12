'use client';

import { useCallback } from 'react';

/**
 * Utility function to get accessibility translation keys
 * @param locale Current locale
 * @param key Translation key path
 * @returns Translated string or fallback
 */
export const getAccessibilityTranslation = async (
  locale: string,
  key: string
): Promise<string> => {
  try {
    // Dynamic import of locale file
    const module = await import(`../app/messages/accessibility/${locale}.json`);
    
    // Split the key path and traverse the object
    const keys = key.split('.');
    let value: any = module;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Key not found, try fallback to en-US
        if (locale !== 'en-US') {
          return getAccessibilityTranslation('en-US', key);
        }
        return key; // Last resort fallback
      }
    }
    
    if (typeof value === 'string') {
      return value;
    }
    
    // If value is not a string, try fallback to en-US
    if (locale !== 'en-US') {
      return getAccessibilityTranslation('en-US', key);
    }
    
    return key; // Last resort fallback
  } catch (error) {
    // If file not found or error, try fallback to en-US
    if (locale !== 'en-US') {
      return getAccessibilityTranslation('en-US', key);
    }
    return key; // Last resort fallback
  }
};

/**
 * React hook for accessibility translations
 * @param locale Current locale
 * @returns Object with translation functions
 */
export const useAccessibilityTranslations = (locale: string = 'pt-BR') => {
  const t = useCallback(
    async (key: string, fallback?: string): Promise<string> => {
      try {
        return await getAccessibilityTranslation(locale, key);
      } catch (error) {
        return fallback || key;
      }
    },
    [locale]
  );
  
  return { t };
};

/**
 * Utility function to announce messages to screen readers
 * @param message Message to announce
 * @param priority Priority of the announcement (polite or assertive)
 */
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
) => {
  if (typeof document === 'undefined') return;
  
  // Create or get the announcer element
  let announcer = document.getElementById(`accessibility-announcer-${priority}`);
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = `accessibility-announcer-${priority}`;
    announcer.className = 'sr-only';
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
  }
  
  // Clear previous announcements
  announcer.textContent = '';
  
  // Use setTimeout to ensure the announcement is made after the DOM updates
  setTimeout(() => {
    announcer!.textContent = message;
  }, 100);
};

/**
 * Utility function to check if high contrast mode is preferred
 * @returns Boolean indicating if high contrast mode is preferred
 */
export const isHighContrastPreferred = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for system preference
  const highContrastQuery = window.matchMedia('(prefers-contrast: more)');
  const highContrastMode = highContrastQuery.matches;
  
  // Check for stored preference
  const storedPreference = localStorage.getItem('high-contrast-mode');
  
  // Stored preference takes precedence over system preference
  if (storedPreference !== null) {
    return storedPreference === 'true';
  }
  
  return highContrastMode;
};

/**
 * Utility function to toggle high contrast mode
 * @param enabled Whether high contrast mode should be enabled
 */
export const toggleHighContrastMode = (enabled: boolean): void => {
  if (typeof document === 'undefined') return;
  
  // Store preference
  localStorage.setItem('high-contrast-mode', String(enabled));
  
  // Apply or remove high contrast class
  if (enabled) {
    document.documentElement.classList.add('high-contrast');
  } else {
    document.documentElement.classList.remove('high-contrast');
  }
  
  // Announce change to screen readers
  const message = enabled
    ? 'Modo de alto contraste ativado'
    : 'Modo de alto contraste desativado';
  
  announceToScreenReader(message, 'polite');
};

/**
 * Utility function to check if reduced motion is preferred
 * @returns Boolean indicating if reduced motion is preferred
 */
export const isReducedMotionPreferred = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return reducedMotionQuery.matches;
};

/**
 * Utility function to format dates in an accessible way
 * @param date Date to format
 * @param locale Current locale
 * @returns Formatted date string
 */
export const formatAccessibleDate = (
  date: Date,
  locale: string = 'pt-BR'
): string => {
  try {
    // Format date according to locale
    const formattedDate = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
    
    return formattedDate;
  } catch (error) {
    // Fallback to ISO format
    return date.toISOString().split('T')[0];
  }
};

/**
 * Utility function to format currency in an accessible way
 * @param value Value to format
 * @param locale Current locale
 * @param currency Currency code
 * @returns Formatted currency string
 */
export const formatAccessibleCurrency = (
  value: number,
  locale: string = 'pt-BR',
  currency: string = 'BRL'
): string => {
  try {
    // Format currency according to locale
    const formattedCurrency = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    
    return formattedCurrency;
  } catch (error) {
    // Fallback to basic format
    return `${currency} ${value.toFixed(2)}`;
  }
};

/**
 * Utility function to format numbers in an accessible way
 * @param value Value to format
 * @param locale Current locale
 * @param options Formatting options
 * @returns Formatted number string
 */
export const formatAccessibleNumber = (
  value: number,
  locale: string = 'pt-BR',
  options?: Intl.NumberFormatOptions
): string => {
  try {
    // Format number according to locale
    const formattedNumber = new Intl.NumberFormat(locale, options).format(value);
    
    return formattedNumber;
  } catch (error) {
    // Fallback to basic format
    return value.toString();
  }
};

/**
 * Utility function to format percentages in an accessible way
 * @param value Value to format (0-1)
 * @param locale Current locale
 * @returns Formatted percentage string
 */
export const formatAccessiblePercentage = (
  value: number,
  locale: string = 'pt-BR'
): string => {
  try {
    // Format percentage according to locale
    const formattedPercentage = new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
    
    return formattedPercentage;
  } catch (error) {
    // Fallback to basic format
    return `${(value * 100).toFixed(0)}%`;
  }
};

/**
 * Utility function to generate accessible IDs
 * @param prefix Prefix for the ID
 * @returns Unique accessible ID
 */
export const generateAccessibleId = (prefix: string = 'a11y'): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
};
