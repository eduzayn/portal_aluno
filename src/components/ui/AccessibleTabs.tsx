'use client';

import React, { forwardRef, HTMLAttributes, useState, useId } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { cn } from '../../lib/utils';

// Tab
export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

// Props das tabs
export interface AccessibleTabsProps extends HTMLAttributes<HTMLDivElement> {
  tabs: Tab[];
  defaultTabId?: string;
  variant?: 'default' | 'pills' | 'underline';
  orientation?: 'horizontal' | 'vertical';
  ariaLabel?: string;
}

// Componente de tabs acessível
const AccessibleTabs = forwardRef<HTMLDivElement, AccessibleTabsProps>(
  (
    {
      className,
      tabs,
      defaultTabId,
      variant = 'default',
      orientation = 'horizontal',
      ariaLabel = 'Abas',
      ...props
    },
    ref
  ) => {
    const { highContrastMode } = useAccessibility();
    const uniqueId = useId();
    
    // Estado para controlar a tab ativa
    const [activeTabId, setActiveTabId] = useState<string>(
      defaultTabId || (tabs.length > 0 ? tabs[0].id : '')
    );
    
    // Classes do container
    const containerClasses = cn(
      orientation === 'horizontal' ? 'flex flex-col' : 'flex flex-row',
      highContrastMode ? 'high-contrast-tabs' : '',
      className
    );
    
    // Classes da lista de tabs
    const tabListClasses = cn(
      'flex',
      orientation === 'horizontal' ? 'flex-row' : 'flex-col',
      variant === 'default' ? 'border-b border-gray-200' : '',
      variant === 'pills' ? 'space-x-2' : '',
      variant === 'underline' ? 'border-b border-gray-200' : '',
      highContrastMode ? 'high-contrast-tablist' : ''
    );
    
    // Classes do painel de conteúdo
    const tabPanelClasses = cn(
      'py-4',
      orientation === 'horizontal' ? 'w-full' : 'flex-1',
      highContrastMode ? 'high-contrast-tabpanel' : ''
    );
    
    // Obter classes do botão de tab
    const getTabButtonClasses = (tab: Tab) => {
      const isActive = tab.id === activeTabId;
      const baseClasses = cn(
        'px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
        tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        highContrastMode ? 'high-contrast-tab' : ''
      );
      
      switch (variant) {
        case 'pills':
          return cn(
            baseClasses,
            'rounded-md',
            isActive
              ? 'bg-primary-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          );
        case 'underline':
          return cn(
            baseClasses,
            'border-b-2 px-1',
            isActive
              ? 'border-primary-500 text-primary-700'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          );
        default:
          return cn(
            baseClasses,
            '-mb-px border-b-2',
            isActive
              ? 'border-primary-500 text-primary-700'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          );
      }
    };
    
    // Manipulador de clique na tab
    const handleTabClick = (tabId: string) => {
      setActiveTabId(tabId);
    };
    
    // Manipulador de teclas para navegação
    const handleKeyDown = (e: React.KeyboardEvent, tabId: string, index: number) => {
      const tabsCount = tabs.length;
      let newIndex = index;
      
      switch (e.key) {
        case 'ArrowRight':
          if (orientation === 'horizontal') {
            newIndex = (index + 1) % tabsCount;
            e.preventDefault();
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal') {
            newIndex = (index - 1 + tabsCount) % tabsCount;
            e.preventDefault();
          }
          break;
        case 'ArrowDown':
          if (orientation === 'vertical') {
            newIndex = (index + 1) % tabsCount;
            e.preventDefault();
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical') {
            newIndex = (index - 1 + tabsCount) % tabsCount;
            e.preventDefault();
          }
          break;
        case 'Home':
          newIndex = 0;
          e.preventDefault();
          break;
        case 'End':
          newIndex = tabsCount - 1;
          e.preventDefault();
          break;
        default:
          return;
      }
      
      // Encontrar a próxima tab não desabilitada
      let nextTab = tabs[newIndex];
      let attempts = 0;
      
      while (nextTab.disabled && attempts < tabsCount) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          newIndex = (newIndex + 1) % tabsCount;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          newIndex = (newIndex - 1 + tabsCount) % tabsCount;
        }
        nextTab = tabs[newIndex];
        attempts++;
      }
      
      if (!nextTab.disabled) {
        setActiveTabId(nextTab.id);
        
        // Focar no botão da tab
        const tabButton = document.getElementById(`tab-${uniqueId}-${nextTab.id}`);
        if (tabButton) {
          tabButton.focus();
        }
      }
    };
    
    // Tab ativa
    const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];
    
    return (
      <div ref={ref} className={containerClasses} {...props}>
        <div
          role="tablist"
          aria-label={ariaLabel}
          aria-orientation={orientation}
          className={tabListClasses}
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              id={`tab-${uniqueId}-${tab.id}`}
              role="tab"
              aria-selected={tab.id === activeTabId}
              aria-controls={`tabpanel-${uniqueId}-${tab.id}`}
              tabIndex={tab.id === activeTabId ? 0 : -1}
              className={getTabButtonClasses(tab)}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id, index)}
              disabled={tab.disabled}
              aria-disabled={tab.disabled}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div
          id={`tabpanel-${uniqueId}-${activeTab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${uniqueId}-${activeTab.id}`}
          tabIndex={0}
          className={tabPanelClasses}
        >
          {activeTab.content}
        </div>
      </div>
    );
  }
);

AccessibleTabs.displayName = 'AccessibleTabs';

export default AccessibleTabs;
