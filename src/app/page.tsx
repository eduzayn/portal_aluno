'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      
      if (data.session) {
        // User is logged in, redirect to dashboard
        router.push('/student/dashboard')
      } else {
        // User is not logged in, redirect to login
        router.push('/login')
      }
    }
    
    checkAuth()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse">
        <p className="text-gray-600">Carregando Portal do Aluno...</p>
      </div>
    </div>
  )
}
