'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { locales } from '../../app/i18n';

export function LanguageSwitcher() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  
  // Map of locale to display name
  const localeNames: Record<string, string> = {
    'pt-BR': 'Português',
    'en-US': 'English',
    'es-ES': 'Español'
  };
  
  const handleLocaleChange = (newLocale: string) => {
    // In a real implementation, we would use next-intl's router
    // For now, we'll use window.location to change the locale
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(/^\/[^\/]+/, `/${newLocale}`);
    window.location.href = newPath;
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{localeNames[locale]}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div 
          className="absolute right-0 mt-1 w-40 bg-white dark:bg-neutral-900 rounded-md shadow-lg z-10 border border-neutral-200 dark:border-neutral-700"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {locales.map((loc) => (
              <button
                key={loc}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  locale === loc 
                    ? 'bg-neutral-100 dark:bg-neutral-800 font-medium' 
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
                onClick={() => handleLocaleChange(loc)}
                role="menuitem"
              >
                {localeNames[loc]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
