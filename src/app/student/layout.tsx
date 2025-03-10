'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Bell } from 'lucide-react'
import { studentNavItems } from '../../../components/student/routes'

interface StudentLayoutProps {
  children: React.ReactNode
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar para desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <Link href="/student/dashboard" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary to-accent rounded-md p-1.5">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="font-bold text-xl">
              Edun<span className="text-primary">éxia</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {studentNavItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === item.path
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              JS
            </div>
            <div>
              <p className="font-medium">João Silva</p>
              <p className="text-sm text-gray-600">Aluno</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Header e conteúdo principal */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6">
          <button
            className="md:hidden mr-4"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold md:hidden">
            Edun<span className="text-primary">éxia</span>
          </h1>
          <div className="ml-auto flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Sidebar móvel */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute top-0 left-0 bottom-0 w-64 bg-white">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <Link href="/student/dashboard" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-primary to-accent rounded-md p-1.5">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <span className="font-bold text-xl">
                  Edun<span className="text-primary">éxia</span>
                </span>
              </Link>
              <button onClick={toggleSidebar}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {studentNavItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === item.path
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={toggleSidebar}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  JS
                </div>
                <div>
                  <p className="font-medium">João Silva</p>
                  <p className="text-sm text-gray-600">Aluno</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
