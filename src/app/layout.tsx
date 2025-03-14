import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '../contexts/AuthContext'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Portal do Aluno - Edunéxia',
  description: 'Portal do Aluno da Edunéxia',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased bg-neutral-50`}>
        <ThemeProvider module="student">
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
