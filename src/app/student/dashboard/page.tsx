'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart2, BookOpen, Award, Bell, MessageSquare } from 'lucide-react'
import { getStudentProfile, getStudentCourses } from '../../../components/student/mock-data'
import { Student, Course } from '../../../components/student/types'
import { CourseCard } from '../../../components/student/course-card'

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<Student | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      try {
        const studentData = await getStudentProfile()
        const coursesData = await getStudentCourses()
        setStudent(studentData)
        setCourses(coursesData)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleContinueCourse = (courseId: string) => {
    router.push(`/student/courses/${courseId}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto">
        <div className="grid gap-6">
          <div className="h-24 animate-pulse rounded-lg bg-gray-200"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-gray-200"></div>
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-lg bg-gray-200"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Dashboard</h1>
      
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Cursos</h2>
          </div>
          <p className="text-3xl font-bold text-foreground">{courses.length}</p>
          <p className="text-sm text-gray-600">Cursos matriculados</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Certificados</h2>
          </div>
          <p className="text-3xl font-bold text-foreground">{student?.certificates.length || 0}</p>
          <p className="text-sm text-gray-600">Certificados obtidos</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Notificações</h2>
          </div>
          <p className="text-3xl font-bold text-foreground">3</p>
          <p className="text-sm text-gray-600">Novas notificações</p>
        </div>
      </div>
      
      {/* Cursos em andamento */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Cursos em Andamento</h2>
          <button 
            className="btn-outline text-sm"
            onClick={() => router.push('/student/courses')}
          >
            Ver todos
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses
            .filter(course => course.status === 'in_progress')
            .slice(0, 3)
            .map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onContinue={handleContinueCourse}
              />
            ))}
          
          {courses.filter(course => course.status === 'in_progress').length === 0 && (
            <div className="col-span-3 rounded-lg border border-dashed p-8 text-center">
              <p className="text-gray-600">Você não tem cursos em andamento.</p>
              <button 
                className="btn-outline mt-4"
                onClick={() => router.push('/student/courses')}
              >
                Explorar cursos
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Atividades recentes */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="gradient-blue-pink p-2 rounded-full">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Aula concluída</p>
                <p className="text-sm text-gray-600">Você concluiu a aula "Introdução ao JavaScript" do curso Desenvolvimento Web</p>
                <p className="text-xs text-gray-600 mt-1">Hoje, 10:30</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="gradient-blue-pink p-2 rounded-full">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Nota atribuída</p>
                <p className="text-sm text-gray-600">Você recebeu nota 9.5/10 no exercício "Estruturas de Dados" do curso Introdução à Programação</p>
                <p className="text-xs text-gray-600 mt-1">Ontem, 15:45</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="gradient-blue-pink p-2 rounded-full">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">Nova mensagem</p>
                <p className="text-sm text-gray-600">Você recebeu uma mensagem do professor Carlos sobre o curso Banco de Dados</p>
                <p className="text-xs text-gray-600 mt-1">2 dias atrás, 09:15</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
