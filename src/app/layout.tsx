import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '../contexts/AuthContext'

export const metadata: Metadata = {
  title: 'Portal do Aluno - Edunéxia',
  description: 'Portal do Aluno para a plataforma educacional Edunéxia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
