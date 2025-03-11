import './globals.css'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Portal do Aluno - Edunéxia',
  description: 'Portal do Aluno para a plataforma educacional Edunéxia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Redirect to the default locale (pt-BR)
  redirect('/pt-BR');
  
  // This part won't be reached due to the redirect
  return null;
}
