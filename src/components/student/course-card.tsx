'use client'

import React from 'react'
import Link from 'next/link'
import { CalendarDays, Clock } from 'lucide-react'
import { Course } from './types'

interface CourseCardProps {
  course: Course
  onContinue: (courseId: string) => void
}

export function CourseCard({ course, onContinue }: CourseCardProps) {
  const getStatusBadge = () => {
    switch (course.status) {
      case 'not_started':
        return <span className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-600">Não iniciado</span>
      case 'in_progress':
        return <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-600">Em andamento</span>
      case 'completed':
        return <span className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-600">Concluído</span>
      default:
        return null
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md bg-white">
      <div className="h-3 bg-indigo-600 w-full"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
          {getStatusBadge()}
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">Progresso: {course.progress}%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex flex-col gap-1 text-sm mb-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Início: {new Date(course.startDate).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Término: {new Date(course.endDate).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        
        <button 
          onClick={() => onContinue(course.id)} 
          className={course.status === 'completed' ? 'btn-outline w-full' : 'btn-primary w-full'}
        >
          {course.status === 'not_started' ? 'Iniciar' : 
           course.status === 'in_progress' ? 'Continuar' : 'Revisar'}
        </button>
      </div>
    </div>
  )
}
