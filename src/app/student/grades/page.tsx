"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
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
  feedback?: string;
  status: 'approved' | 'failed' | 'pending';
}

interface CourseGrades {
  courseId: string;
  courseName: string;
  averageGrade: number;
  grades: Grade[];
}

// Mock data function - would be replaced with actual API call
const getStudentGrades = async (userId: string): Promise<CourseGrades[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      courseId: '1',
      courseName: 'Desenvolvimento Web Fullstack',
      averageGrade: 85,
      grades: [
        {
          id: '101',
          courseId: '1',
          courseName: 'Desenvolvimento Web Fullstack',
          moduleId: 'm1',
          moduleName: 'Fundamentos de HTML e CSS',
          activityId: 'a1',
          activityName: 'Projeto: Página Pessoal',
          grade: 90,
          maxGrade: 100,
          date: '2025-02-15',
          feedback: 'Excelente trabalho! Boa estrutura semântica e design responsivo.',
          status: 'approved'
        },
        {
          id: '102',
          courseId: '1',
          courseName: 'Desenvolvimento Web Fullstack',
          moduleId: 'm2',
          moduleName: 'JavaScript Básico',
          activityId: 'a2',
          activityName: 'Quiz: Fundamentos de JavaScript',
          grade: 80,
          maxGrade: 100,
          date: '2025-02-28',
          feedback: 'Bom conhecimento dos conceitos básicos. Revise closures e promises.',
          status: 'approved'
        },
        {
          id: '103',
          courseId: '1',
          courseName: 'Desenvolvimento Web Fullstack',
          moduleId: 'm3',
          moduleName: 'React Fundamentals',
          activityId: 'a3',
          activityName: 'Projeto: App de Tarefas',
          grade: 85,
          maxGrade: 100,
          date: '2025-03-10',
          status: 'approved'
        }
      ]
    },
    {
      courseId: '2',
      courseName: 'Banco de Dados SQL',
      averageGrade: 78,
      grades: [
        {
          id: '201',
          courseId: '2',
          courseName: 'Banco de Dados SQL',
          moduleId: 'm1',
          moduleName: 'Modelagem de Dados',
          activityId: 'a1',
          activityName: 'Diagrama ER',
          grade: 75,
          maxGrade: 100,
          date: '2025-02-10',
          feedback: 'Bom trabalho, mas faltou normalização adequada.',
          status: 'approved'
        },
        {
          id: '202',
          courseId: '2',
          courseName: 'Banco de Dados SQL',
          moduleId: 'm2',
          moduleName: 'Consultas SQL Avançadas',
          activityId: 'a2',
          activityName: 'Exercícios de Joins e Subqueries',
          grade: 82,
          maxGrade: 100,
          date: '2025-02-25',
          status: 'approved'
        },
        {
          id: '203',
          courseId: '2',
          courseName: 'Banco de Dados SQL',
          moduleId: 'm3',
          moduleName: 'Otimização de Consultas',
          activityId: 'a3',
          activityName: 'Projeto: Otimização de Banco de Dados',
          grade: 65,
          maxGrade: 100,
          date: '2025-03-05',
          feedback: 'Precisa melhorar a compreensão de índices e planos de execução.',
          status: 'pending'
        }
      ]
    }
  ];
};

export default function GradesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courseGrades, setCourseGrades] = useState<CourseGrades[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    async function loadGrades() {
      if (!user || !user.id) {
        // Mostrar estado de carregamento em vez de redirecionar imediatamente
        setLoading(true);
        return;
      }

      try {
        setLoading(true);
        const grades = await getStudentGrades(user.id);
        setCourseGrades(grades);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar notas:', error);
        setError('Não foi possível carregar suas notas. Tente novamente mais tarde.');
        setLoading(false);
      }
    }
    
    loadGrades();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'pending':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovado';
      case 'failed':
        return 'Reprovado';
      case 'pending':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 50) return 'text-amber-600';
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
      <h1 className="text-2xl font-bold mb-6">Minhas Notas</h1>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all" onClick={() => setActiveTab('all')}>Todos os Cursos</TabsTrigger>
          {courseGrades.map(course => (
            <TabsTrigger 
              key={course.courseId} 
              value={course.courseId}
              onClick={() => setActiveTab(course.courseId)}
            >
              {course.courseName}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courseGrades.map(course => (
              <Card key={course.courseId} className="shadow-md">
                <CardHeader>
                  <CardTitle>{course.courseName}</CardTitle>
                  <CardDescription>Média: {course.averageGrade}%</CardDescription>
                  <Progress value={course.averageGrade} className="h-2 mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.grades.map(grade => (
                      <div key={grade.id} className="border-b pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{grade.activityName}</h4>
                            <p className="text-sm text-gray-500">{grade.moduleName}</p>
                          </div>
                          <div className="text-right">
                            <span className={`font-bold ${getGradeColor(grade.grade, grade.maxGrade)}`}>
                              {grade.grade}/{grade.maxGrade}
                            </span>
                            <p className={`text-sm ${getStatusColor(grade.status)}`}>
                              {getStatusLabel(grade.status)}
                            </p>
                          </div>
                        </div>
                        {grade.feedback && (
                          <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                            <span className="font-medium">Feedback:</span> {grade.feedback}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {courseGrades.map(course => (
          <TabsContent key={course.courseId} value={course.courseId}>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>{course.courseName}</CardTitle>
                <CardDescription>Média: {course.averageGrade}%</CardDescription>
                <Progress value={course.averageGrade} className="h-2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.grades.map(grade => (
                    <div key={grade.id} className="border-b pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{grade.activityName}</h4>
                          <p className="text-sm text-gray-500">{grade.moduleName}</p>
                          <p className="text-xs text-gray-400">Data: {new Date(grade.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold ${getGradeColor(grade.grade, grade.maxGrade)}`}>
                            {grade.grade}/{grade.maxGrade}
                          </span>
                          <p className={`text-sm ${getStatusColor(grade.status)}`}>
                            {getStatusLabel(grade.status)}
                          </p>
                        </div>
                      </div>
                      {grade.feedback && (
                        <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                          <span className="font-medium">Feedback:</span> {grade.feedback}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
