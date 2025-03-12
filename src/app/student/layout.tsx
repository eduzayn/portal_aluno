'use client'

import React from 'react'
import { MainLayout } from '../../components/layout/MainLayout'
import { studentNavItems } from '../../components/student/routes'

interface StudentLayoutProps {
  children: React.ReactNode
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <MainLayout module="student" navItems={studentNavItems}>
      {children}
    </MainLayout>
  )
}
