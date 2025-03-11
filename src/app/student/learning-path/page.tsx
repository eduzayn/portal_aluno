'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Circle, CheckCircle, Clock, BookOpen, ArrowRight } from 'lucide-react'
import { getLearningPaths } from '../../../components/student/mock-data'
import { LearningPath, Module, Lesson } from '../../../components/student/types'

export default function LearningPathPage() {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [activePath, setActivePath] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
   async function loadData() {
      try {
        const pathsData = await getLearningPaths()
        setLearningPaths(pathsData as LearningPath[])
        if (pathsData.length > 0) {
          setActivePath(pathsData[0].id)
        }
      } catch (error) {
        console.error('Error loading learning paths:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleTabChange = (pathId: string): void => {
    setActivePath(pathId)
  }

  if (loading) {
    return (
      <div className="container mx-auto">
        <div className="animate-pulse space-y-6" data-testid="loading-skeleton">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const currentPath = learningPaths.find(path => path.id === activePath) || {} as Partial<LearningPath>

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Rota de Aprendizagem</h1>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          {learningPaths.map((path: LearningPath) => (
            <button
              key={path.id}
              className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
                activePath === path.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              onClick={() => handleTabChange(path.id)}
              data-testid={`path-tab-${path.id}`}
            >
              {path.title}
            </button>
          ))}
        </div>
      </div>
      
      {/* Path Content */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">{currentPath.title}</h2>
        <p className="text-gray-600">{currentPath.description}</p>
      </div>
      
      {/* Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPath.modules?.map((module: Module, index: number) => (
          <div 
            key={module.id} 
            className={`status-card border rounded-lg overflow-hidden shadow-sm hover:shadow transition-all duration-200 ${
              module.status === 'completed' ? 'status-card-green border-green-200' :
              module.status === 'in_progress' ? 'status-card-blue border-blue-200' :
              module.status === 'locked' ? 'status-card-red border-gray-200' : 'status-card-purple border-purple-200'
            }`}
          >
            <div className="p-4 bg-white">
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${
                  module.status === 'completed' ? 'text-green-500' :
                  module.status === 'in_progress' ? 'text-indigo-500' :
                  module.status === 'locked' ? 'text-gray-300' : 'text-purple-500'
                }`}>
                  {module.status === 'completed' ? <CheckCircle className="h-5 w-5" /> :
                   module.status === 'in_progress' ? <Circle className="h-5 w-5 text-indigo-500 fill-indigo-100" /> :
                   module.status === 'locked' ? <Circle className="h-5 w-5" /> :
                   <BookOpen className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{module.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{module.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{module.lessons.length} lições</span>
                    </div>
                  </div>
                </div>
                <div>
                  <button 
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      module.status === 'locked' 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1'
                    }`}
                    disabled={module.status === 'locked'}
                    data-testid={`module-action-${module.id}`}
                  >
                    {module.status === 'completed' ? 'Revisar' :
                     module.status === 'in_progress' ? 'Continuar' :
                     module.status === 'locked' ? 'Bloqueado' : 'Iniciar'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Lista de lições */}
            <div className="bg-gray-50 p-4 border-t border-gray-100">
              <h4 className="text-sm font-medium mb-3 text-gray-700">Lições</h4>
              <div className="space-y-3">
                {module.lessons.map((lesson: Lesson) => (
                  <div 
                    key={lesson.id} 
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 ${
                      lesson.status === 'locked' ? 'opacity-50' : ''
                    }`}
                  >
                    <div className={`${
                      lesson.status === 'completed' ? 'text-green-500' :
                      lesson.status === 'in_progress' ? 'text-indigo-500' :
                      lesson.status === 'locked' ? 'text-gray-300' : 'text-purple-500'
                    }`}>
                      {lesson.status === 'completed' ? <CheckCircle className="h-4 w-4" /> :
                       lesson.status === 'in_progress' ? <Circle className="h-4 w-4 text-indigo-500 fill-indigo-100" /> :
                       <Circle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{lesson.title}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{lesson.type === 'video' ? 'Vídeo' : 
                               lesson.type === 'reading' ? 'Leitura' : 
                               lesson.type === 'quiz' ? 'Quiz' : 'Atividade'}</span>
                        <span>•</span>
                        <span>{lesson.duration}</span>
                      </div>
                    </div>
                    <button 
                      className="p-1 text-gray-500 hover:text-indigo-600 disabled:opacity-50 transition-colors"
                      disabled={lesson.status === 'locked'}
                      data-testid={`lesson-action-${lesson.id}`}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
