import '../globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../../contexts/AuthContext';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '../i18n';

export const metadata: Metadata = {
  title: 'Portal do Aluno - Edunéxia',
  description: 'Portal do Aluno para a plataforma educacional Edunéxia',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming locale is supported
  if (!locales.includes(params.locale)) {
    notFound();
  }
  
  // Load messages for the requested locale
  let messages;
  try {
    messages = (await import(`../messages/${params.locale}.json`)).default;
  } catch (error) {
    notFound();
  }
  
  return (
    <html lang={params.locale}>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
