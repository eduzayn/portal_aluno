'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        
        if (data.session) {
          // User is logged in
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  // Instead of automatic redirects, show links to prevent redirect loops
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {loading ? (
        <div className="animate-pulse">
          <p className="text-gray-600">Carregando Portal do Aluno...</p>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Portal do Aluno - Edunéxia</h1>
          <div className="space-y-4">
            {isAuthenticated ? (
              <Link 
                href="/student/dashboard"
                className="block w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Acessar Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="block w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Entrar
                </Link>
                <Link 
                  href="/register"
                  className="block w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Registrar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
