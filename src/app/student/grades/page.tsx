"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Progress } from '../../../components/ui/Progress';

interface Grade {
  id: string;
  courseId: string;
  courseName: string;
  moduleId?: string;
  moduleName?: string;
  activityId?: string;
  activityName?: string;
  grade: number;
  maxGrade: number;
  date: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  progress: number;
  averageGrade: number;
}

// Mock data function - would be replaced with actual API call
const getStudentGrades = async (userId: string): Promise<{ grades: Grade[], courses: Course[] }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const grades: Grade[] = [
    {
      id: '1',
      courseId: 'course-1',
      courseName: 'Desenvolvimento Web Fullstack',
      moduleId: 'module-1',
      moduleName: 'Fundamentos de HTML e CSS',
      activityId: 'activity-1',
      activityName: 'Projeto: Página Pessoal',
      grade: 85,
      maxGrade: 100,
      date: '2025-03-10'
    },
    {
      id: '2',
      courseId: 'course-1',
      courseName: 'Desenvolvimento Web Fullstack',
      moduleId: 'module-2',
      moduleName: 'JavaScript Básico',
      activityId: 'activity-2',
      activityName: 'Quiz: Conceitos de JavaScript',
      grade: 90,
      maxGrade: 100,
      date: '2025-03-05'
    },
    {
      id: '3',
      courseId: 'course-1',
      courseName: 'Desenvolvimento Web Fullstack',
      moduleId: 'module-2',
      moduleName: 'JavaScript Básico',
      activityId: 'activity-3',
      activityName: 'Projeto: Calculadora',
      grade: 78,
      maxGrade: 100,
      date: '2025-03-01'
    },
    {
      id: '4',
      courseId: 'course-2',
      courseName: 'Banco de Dados',
      moduleId: 'module-1',
      moduleName: 'Modelagem de Dados',
      activityId: 'activity-1',
      activityName: 'Diagrama ER',
      grade: 92,
      maxGrade: 100,
      date: '2025-02-28'
    },
    {
      id: '5',
      courseId: 'course-2',
      courseName: 'Banco de Dados',
      moduleId: 'module-2',
      moduleName: 'SQL Básico',
      activityId: 'activity-2',
      activityName: 'Exercícios de SQL',
      grade: 88,
      maxGrade: 100,
      date: '2025-02-20'
    },
    {
      id: '6',
      courseId: 'course-3',
      courseName: 'Estruturas de Dados',
      moduleId: 'module-1',
      moduleName: 'Arrays e Listas Encadeadas',
      activityId: 'activity-1',
      activityName: 'Implementação de Lista Encadeada',
      grade: 75,
      maxGrade: 100,
      date: '2025-02-15'
    }
  ];
  
  const courses: Course[] = [
    {
      id: 'course-1',
      name: 'Desenvolvimento Web Fullstack',
      code: 'DWF-101',
      instructor: 'Prof. Carlos Silva',
      progress: 65,
      averageGrade: 84.3
    },
    {
      id: 'course-2',
      name: 'Banco de Dados',
      code: 'BD-201',
      instructor: 'Profa. Ana Martins',
      progress: 80,
      averageGrade: 90
    },
    {
      id: 'course-3',
      name: 'Estruturas de Dados',
      code: 'ED-301',
      instructor: 'Prof. Roberto Almeida',
      progress: 40,
      averageGrade: 75
    }
  ];
  
  return { grades, courses };
};

export default function GradesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    async function loadGrades() {
      if (!user || !user.id) {
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
        const data = await getStudentGrades(user.id);
        setGrades(data.grades);
        setCourses(data.courses);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar notas:', error);
        setError('Não foi possível carregar suas notas. Tente novamente mais tarde.');
        setLoading(false);
      }
    }
    
    loadGrades();
  }, [user]);

  const filteredGrades = selectedCourse 
    ? grades.filter(grade => grade.courseId === selectedCourse)
    : grades;

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Erro</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Notas e Desempenho</h1>
        <p className="text-gray-600">Acompanhe seu desempenho acadêmico</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Resumo dos Cursos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <Card 
              key={course.id} 
              className={`cursor-pointer hover:shadow-md transition-shadow ${selectedCourse === course.id ? 'ring-2 ring-indigo-500' : ''}`}
              onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{course.name}</CardTitle>
                <CardDescription>{course.code} • {course.instructor}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Progresso</span>
                    <span className="text-sm font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Média</span>
                  <span className={`text-sm font-medium ${getGradeColor(course.averageGrade, 100)}`}>
                    {course.averageGrade.toFixed(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Atividades e Avaliações</h2>
          {selectedCourse && (
            <button 
              onClick={() => setSelectedCourse(null)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Mostrar todos os cursos
            </button>
          )}
        </div>
        
        {filteredGrades.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">Nenhuma atividade avaliada encontrada.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Curso / Módulo / Atividade
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nota
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrades.map(grade => (
                  <tr key={grade.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{grade.courseName}</div>
                      {grade.moduleName && (
                        <div className="text-sm text-gray-500">{grade.moduleName}</div>
                      )}
                      {grade.activityName && (
                        <div className="text-sm font-medium text-indigo-600">{grade.activityName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(grade.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-medium ${getGradeColor(grade.grade, grade.maxGrade)}`}>
                        {grade.grade} / {grade.maxGrade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
