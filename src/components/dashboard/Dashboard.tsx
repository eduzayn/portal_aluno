'use client';

import React from 'react';
import { colors } from '../../styles/colors';
import { BarChart2, BookOpen, CreditCard, Calendar, GraduationCap, Clock, Award } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, description, icon, color }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
    <div className="p-1" style={{ background: color }}></div>
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium text-neutral-800">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
        </div>
        <div className="p-3 rounded-full bg-neutral-100">
          {icon}
        </div>
      </div>
    </div>
  </div>
);

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  color: string;
}

const ChartCard = ({ title, children, color }: ChartCardProps) => (
  <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
    <div className="p-1" style={{ background: color }}></div>
    <div className="p-6">
      <h3 className="text-lg font-medium text-neutral-800 mb-4">{title}</h3>
      {children}
    </div>
  </div>
);

interface DashboardProps {
  data?: any;
}

export const Dashboard = ({ 
  data = {
    stats: [
      { title: 'Cursos Matriculados', value: 4, description: '2 em andamento' },
      { title: 'Progresso Geral', value: '68%', description: '+12% este mês' },
      { title: 'Certificados', value: 2, description: '1 pendente de emissão' },
      { title: 'Próximo Pagamento', value: 'R$ 297,00', description: 'Vence em 15/03/2025' },
    ]
  }
}: DashboardProps) => {
  const moduleColor = colors.primary.student;
  
  // Icons for student portal
  const getIcon = (index: number) => {
    const icons = [
      <GraduationCap key="courses" size={24} color={moduleColor.main} />,
      <BarChart2 key="progress" size={24} color={moduleColor.main} />,
      <Award key="certificates" size={24} color={moduleColor.main} />,
      <CreditCard key="payment" size={24} color={moduleColor.main} />
    ];
    return icons[index % icons.length];
  };
  
  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Meu Dashboard
          </h1>
          <p className="text-neutral-500 mt-1">
            Bem-vindo de volta, Aluno!
          </p>
        </div>
        <div>
          <button 
            className="px-4 py-2 rounded-md text-white font-medium"
            style={{ background: moduleColor.gradient }}
          >
            Ver Todos os Cursos
          </button>
        </div>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.stats.map((stat: any, index: number) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={getIcon(index)}
            color={moduleColor.gradient}
          />
        ))}
      </div>
      
      {/* Current courses */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-1" style={{ background: moduleColor.gradient }}></div>
        <div className="p-6">
          <h3 className="text-lg font-medium text-neutral-800 mb-4">Cursos em Andamento</h3>
          
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md bg-emerald-100 flex items-center justify-center mr-4">
                      <BookOpen size={24} color={moduleColor.main} />
                    </div>
                    <div>
                      <h4 className="font-medium">Desenvolvimento Web Avançado</h4>
                      <p className="text-sm text-neutral-500">12 de 20 aulas concluídas</p>
                    </div>
                  </div>
                  <div>
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-emerald-600">60%</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-neutral-100 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full" style={{ width: '60%', background: moduleColor.gradient }}></div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="flex items-center text-sm text-neutral-500">
                    <Clock size={16} className="mr-1" />
                    <span>Última aula: 2 dias atrás</span>
                  </div>
                  <button 
                    className="px-3 py-1 rounded text-sm font-medium"
                    style={{ color: moduleColor.main, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Calendar and upcoming events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Calendário Acadêmico" color={moduleColor.gradient}>
          <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-md">
            <p className="text-neutral-400">Calendário de Aulas</p>
          </div>
        </ChartCard>
        
        <ChartCard title="Próximos Eventos" color={moduleColor.gradient}>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center p-3 border-b border-neutral-100 last:border-0">
                <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center mr-4">
                  <Calendar size={20} color={moduleColor.main} />
                </div>
                <div>
                  <p className="font-medium">Aula ao Vivo: React Avançado</p>
                  <p className="text-sm text-neutral-500">15 de Março, 19:00</p>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
