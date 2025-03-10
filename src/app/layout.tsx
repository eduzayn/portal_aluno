import './globals.css'
import type { Metadata } from 'next'

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
      <body>{children}</body>
    </html>
  )
}
