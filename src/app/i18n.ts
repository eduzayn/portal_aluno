import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Define supported languages
export const locales = ['pt-BR', 'en-US', 'es-ES'];
export const defaultLocale = 'pt-BR';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming locale is supported
  if (!locales.includes(locale)) notFound();
  
  // Load messages for the requested locale
  const messages = (await import(`./messages/${locale}.json`)).default;
  
  return {
    messages,
    // Use ICU syntax for plurals and other complex translations
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        },
        medium: {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }
      },
      number: {
        currency: {
          style: 'currency',
          currency: 'BRL'
        }
      }
    }
  };
});
