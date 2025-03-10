'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStudentCourses } from '../../../components/student/mock-data'
import { Course } from '../../../components/student/types'
import { CourseCard } from '../../../components/student/course-card'

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      try {
        const coursesData = await getStudentCourses()
        setCourses(coursesData)
      } catch (error) {
        console.error('Error loading courses:', error)
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
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Meus Cursos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard 
            key={course.id} 
            course={course} 
            onContinue={handleContinueCourse}
          />
        ))}
        
        {courses.length === 0 && (
          <div className="col-span-3 rounded-lg border border-dashed p-8 text-center">
            <p className="text-gray-600">Você não está matriculado em nenhum curso.</p>
            <button className="btn-outline mt-4">
              Explorar cursos disponíveis
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
