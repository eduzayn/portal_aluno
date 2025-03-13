'use client';

import React, { useState } from 'react';
import { FileCheck, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface Grade {
  id: string;
  courseId: string;
  courseName: string;
  activityName: string;
  activityType: 'prova' | 'trabalho' | 'projeto' | 'exercício';
  grade: number;
  maxGrade: number;
  date: string;
  feedback?: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  semester: string;
  grades: Grade[];
  averageGrade: number;
}

export default function GradesPage() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      name: 'Introdução à Programação',
      code: 'CS101',
      semester: '2025.1',
      averageGrade: 8.5,
      grades: [
        {
          id: '1-1',
          courseId: '1',
          courseName: 'Introdução à Programação',
          activityName: 'Prova 1',
          activityType: 'prova',
          grade: 8.0,
          maxGrade: 10,
          date: '2025-02-15',
          feedback: 'Bom desempenho, mas precisa melhorar na parte de loops.'
        },
        {
          id: '1-2',
          courseId: '1',
          courseName: 'Introdução à Programação',
          activityName: 'Trabalho Prático',
          activityType: 'trabalho',
          grade: 9.5,
          maxGrade: 10,
          date: '2025-03-01',
          feedback: 'Excelente trabalho! Código bem organizado e documentado.'
        },
        {
          id: '1-3',
          courseId: '1',
          courseName: 'Introdução à Programação',
          activityName: 'Prova 2',
          activityType: 'prova',
          grade: 8.0,
          maxGrade: 10,
          date: '2025-03-20',
        },
      ]
    },
    {
      id: '2',
      name: 'Estruturas de Dados',
      code: 'CS201',
      semester: '2025.1',
      averageGrade: 7.2,
      grades: [
        {
          id: '2-1',
          courseId: '2',
          courseName: 'Estruturas de Dados',
          activityName: 'Prova 1',
          activityType: 'prova',
          grade: 7.0,
          maxGrade: 10,
          date: '2025-02-20',
          feedback: 'Precisa melhorar na compreensão de árvores binárias.'
        },
        {
          id: '2-2',
          courseId: '2',
          courseName: 'Estruturas de Dados',
          activityName: 'Projeto de Implementação',
          activityType: 'projeto',
          grade: 8.5,
          maxGrade: 10,
          date: '2025-03-10',
          feedback: 'Boa implementação, mas a documentação poderia ser melhor.'
        },
        {
          id: '2-3',
          courseId: '2',
          courseName: 'Estruturas de Dados',
          activityName: 'Exercícios de Fixação',
          activityType: 'exercício',
          grade: 6.0,
          maxGrade: 10,
          date: '2025-03-05',
          feedback: 'Precisa praticar mais os exercícios de recursão.'
        },
      ]
    },
    {
      id: '3',
      name: 'Banco de Dados',
      code: 'CS301',
      semester: '2025.1',
      averageGrade: 9.0,
      grades: [
        {
          id: '3-1',
          courseId: '3',
          courseName: 'Banco de Dados',
          activityName: 'Prova 1',
          activityType: 'prova',
          grade: 9.0,
          maxGrade: 10,
          date: '2025-02-25',
          feedback: 'Excelente compreensão dos conceitos de normalização.'
        },
        {
          id: '3-2',
          courseId: '3',
          courseName: 'Banco de Dados',
          activityName: 'Projeto de Modelagem',
          activityType: 'projeto',
          grade: 9.5,
          maxGrade: 10,
          date: '2025-03-15',
          feedback: 'Modelo ER muito bem elaborado e implementado.'
        },
        {
          id: '3-3',
          courseId: '3',
          courseName: 'Banco de Dados',
          activityName: 'Exercícios SQL',
          activityType: 'exercício',
          grade: 8.5,
          maxGrade: 10,
          date: '2025-03-08',
          feedback: 'Boas consultas, mas poderia otimizar algumas queries.'
        },
      ]
    },
  ]);

  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const toggleCourseExpand = (courseId: string) => {
    setExpandedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notas</h1>
        <p className="text-gray-600">Visualize suas notas e avaliações</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Média Geral</h2>
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <FileCheck className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {(courses.reduce((sum, course) => sum + course.averageGrade, 0) / courses.length).toFixed(1)}
          </div>
          <p className="text-sm text-gray-500 mt-1">de 10.0 pontos possíveis</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Disciplinas</h2>
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <FileCheck className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{courses.length}</div>
          <p className="text-sm text-gray-500 mt-1">disciplinas no semestre atual</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Avaliações</h2>
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <FileCheck className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {courses.reduce((sum, course) => sum + course.grades.length, 0)}
          </div>
          <p className="text-sm text-gray-500 mt-1">avaliações realizadas</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Notas por Disciplina</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {courses.map((course) => (
            <div key={course.id} className="bg-white">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleCourseExpand(course.id)}
              >
                <div>
                  <h3 className="text-md font-medium text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-500">
                    {course.code} • {course.semester}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(course.averageGrade, 10)}`}>
                    {course.averageGrade.toFixed(1)}
                  </div>
                  {expandedCourses.includes(course.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {expandedCourses.includes(course.id) && (
                <div className="px-4 pb-4">
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Atividade
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Tipo
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Data
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Nota
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {course.grades.map((grade) => (
                          <tr
                            key={grade.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedGrade(grade)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {grade.activityName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {grade.activityType.charAt(0).toUpperCase() + grade.activityType.slice(1)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(grade.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(grade.grade, grade.maxGrade)}`}>
                                {grade.grade.toFixed(1)} / {grade.maxGrade.toFixed(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedGrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">{selectedGrade.activityName}</h3>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setSelectedGrade(null)}
              >
                <span className="sr-only">Fechar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-500">Disciplina</p>
                <p className="text-md font-medium">{selectedGrade.courseName}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Tipo de Atividade</p>
                <p className="text-md font-medium">
                  {selectedGrade.activityType.charAt(0).toUpperCase() + selectedGrade.activityType.slice(1)}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Data</p>
                <p className="text-md font-medium">{formatDate(selectedGrade.date)}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">Nota</p>
                <div className="flex items-center mt-1">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(selectedGrade.grade, selectedGrade.maxGrade)}`}>
                    {selectedGrade.grade.toFixed(1)} / {selectedGrade.maxGrade.toFixed(1)}
                  </div>
                  <div className="ml-2 text-sm text-gray-500">
                    ({((selectedGrade.grade / selectedGrade.maxGrade) * 100).toFixed(0)}%)
                  </div>
                </div>
              </div>
              {selectedGrade.feedback && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Feedback do Professor</p>
                  <div className="mt-1 p-3 bg-indigo-50 rounded-lg text-sm text-gray-800">
                    {selectedGrade.feedback}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setSelectedGrade(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
