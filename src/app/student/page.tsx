'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { studentRoutes } from '../../components/student/routes'

export default function StudentPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard
    router.push(studentRoutes.dashboard)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">
        <p className="text-gray-600">Redirecionando...</p>
      </div>
    </div>
  )
}
