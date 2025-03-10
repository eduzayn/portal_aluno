'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to student dashboard
    router.push('/student/dashboard')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">
        <p className="text-gray-600">Redirecionando para o Portal do Aluno...</p>
      </div>
    </div>
  )
}
