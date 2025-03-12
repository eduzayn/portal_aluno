'use client';

import React from 'react';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  module?: 'communication' | 'student' | 'content' | 'enrollment';
  navItems: Array<{
    path: string;
    name: string;
    icon: any;
  }>;
}

export const MainLayout = ({ 
  children, 
  module = 'student',
  navItems = []
}: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar module={module} navItems={navItems} />
      
      <div className="flex flex-col w-full md:pl-64">
        {/* Mobile padding for header */}
        <div className="h-16 md:hidden"></div>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
