import { Student, Course, Certificate } from './types';

export const getStudentProfile = async (): Promise<Student> => {
  return {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@example.com',
    enrollmentDate: '2023-01-15',
    certificates: [
      {
        id: 'cert1',
        title: 'Certificado de Conclusão',
        courseId: 'course1',
        courseName: 'Desenvolvimento Web',
        issueDate: '2023-06-30',
        downloadUrl: '/certificates/cert1.pdf',
      },
      {
        id: 'cert2',
        title: 'Certificado de Participação',
        courseId: 'course2',
        courseName: 'Banco de Dados',
        issueDate: '2023-08-15',
        downloadUrl: '/certificates/cert2.pdf',
      },
    ],
  };
};

export const getStudentCourses = async (): Promise<Course[]> => {
  return [
    {
      id: 'course1',
      title: 'Desenvolvimento Web',
      description: 'Aprenda HTML, CSS e JavaScript do zero ao avançado',
      instructor: 'Carlos Oliveira',
      startDate: '2023-02-01',
      endDate: '2023-07-30',
      progress: 75,
      status: 'in_progress',
      modules: [],
    },
    {
      id: 'course2',
      title: 'Banco de Dados',
      description: 'Fundamentos de SQL e modelagem de dados',
      instructor: 'Ana Souza',
      startDate: '2023-03-15',
      endDate: '2023-08-30',
      progress: 40,
      status: 'in_progress',
      modules: [],
    },
    {
      id: 'course3',
      title: 'Programação Orientada a Objetos',
      description: 'Conceitos e práticas de POO com Java',
      instructor: 'Roberto Santos',
      startDate: '2023-05-01',
      endDate: '2023-10-30',
      progress: 10,
      status: 'in_progress',
      modules: [],
    },
    {
      id: 'course4',
      title: 'Introdução à Inteligência Artificial',
      description: 'Fundamentos e aplicações de IA',
      instructor: 'Mariana Costa',
      startDate: '2023-09-01',
      endDate: '2024-02-28',
      progress: 0,
      status: 'not_started',
      modules: [],
    },
  ];
};

export const getLearningPaths = async () => {
  return [
    {
      id: 'path1',
      title: 'Desenvolvimento Web',
      description: 'Trilha completa para se tornar um desenvolvedor web',
      modules: [
        {
          id: 'module1',
          title: 'Fundamentos de HTML',
          description: 'Estrutura básica e tags HTML',
          duration: '2 semanas',
          status: 'completed',
          lessons: [
            {
              id: 'lesson1',
              title: 'Introdução ao HTML',
              description: 'Conceitos básicos de HTML',
              duration: '45 min',
              type: 'video',
              status: 'completed',
            },
            {
              id: 'lesson2',
              title: 'Tags e Atributos',
              description: 'Principais tags e seus atributos',
              duration: '60 min',
              type: 'reading',
              status: 'completed',
            },
            {
              id: 'lesson3',
              title: 'Exercício Prático',
              description: 'Criando sua primeira página',
              duration: '90 min',
              type: 'assignment',
              status: 'completed',
            },
          ],
        },
        {
          id: 'module2',
          title: 'CSS Básico',
          description: 'Estilização de páginas web',
          duration: '3 semanas',
          status: 'in_progress',
          lessons: [
            {
              id: 'lesson4',
              title: 'Introdução ao CSS',
              description: 'Sintaxe e seletores',
              duration: '50 min',
              type: 'video',
              status: 'completed',
            },
            {
              id: 'lesson5',
              title: 'Box Model',
              description: 'Entendendo o modelo de caixa',
              duration: '45 min',
              type: 'video',
              status: 'in_progress',
            },
            {
              id: 'lesson6',
              title: 'Layouts com Flexbox',
              description: 'Criando layouts flexíveis',
              duration: '60 min',
              type: 'video',
              status: 'locked',
            },
          ],
        },
        {
          id: 'module3',
          title: 'JavaScript Básico',
          description: 'Fundamentos de programação com JavaScript',
          duration: '4 semanas',
          status: 'locked',
          lessons: [
            {
              id: 'lesson7',
              title: 'Variáveis e Tipos',
              description: 'Tipos de dados e declaração de variáveis',
              duration: '55 min',
              type: 'video',
              status: 'locked',
            },
            {
              id: 'lesson8',
              title: 'Estruturas de Controle',
              description: 'Condicionais e loops',
              duration: '65 min',
              type: 'video',
              status: 'locked',
            },
          ],
        },
      ],
    },
    {
      id: 'path2',
      title: 'Banco de Dados',
      description: 'Aprenda a modelar e gerenciar bancos de dados',
      modules: [
        {
          id: 'module4',
          title: 'Introdução a Bancos de Dados',
          description: 'Conceitos fundamentais',
          duration: '2 semanas',
          status: 'in_progress',
          lessons: [
            {
              id: 'lesson9',
              title: 'O que são Bancos de Dados',
              description: 'Conceitos e tipos de bancos',
              duration: '40 min',
              type: 'video',
              status: 'completed',
            },
            {
              id: 'lesson10',
              title: 'Modelos de Dados',
              description: 'Relacional, NoSQL e outros',
              duration: '55 min',
              type: 'reading',
              status: 'in_progress',
            },
          ],
        },
      ],
    },
  ];
};
