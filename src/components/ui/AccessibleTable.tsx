'use client';

import React, { forwardRef, TableHTMLAttributes, useState, useEffect } from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import { cn } from '../../lib/utils';
import useKeyboardNavigation from '../../hooks/useKeyboardNavigation';

// Props da tabela
export interface AccessibleTableProps extends TableHTMLAttributes<HTMLTableElement> {
  caption?: string;
  headers: string[];
  data: any[][];
  emptyMessage?: string;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  hideCaption?: boolean;
  rowActions?: React.ReactNode[];
  onRowClick?: (rowIndex: number) => void;
  highlightedRow?: number;
}

// Componente de tabela acessível
const AccessibleTable = forwardRef<HTMLTableElement, AccessibleTableProps>(
  (
    {
      className,
      caption,
      headers,
      data,
      emptyMessage = 'Nenhum dado encontrado',
      sortable = false,
      pagination = false,
      pageSize = 10,
      ariaLabel,
      ariaDescribedBy,
      hideCaption = false,
      rowActions,
      onRowClick,
      highlightedRow,
      ...props
    },
    ref
  ) => {
    const { highContrastMode, announceToScreenReader } = useAccessibility();
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState<number | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    
    const tableId = props.id || `table-${Math.random().toString(36).substring(2, 9)}`;
    const captionId = `${tableId}-caption`;
    
    // Calcular dados paginados e ordenados
    const sortedData = React.useMemo(() => {
      if (sortColumn === null || !sortable) return data;
      
      return [...data].sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];
        
        if (valueA === valueB) return 0;
        
        const comparison = valueA < valueB ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }, [data, sortColumn, sortDirection, sortable]);
    
    const totalPages = pagination ? Math.ceil(sortedData.length / pageSize) : 1;
    
    const paginatedData = React.useMemo(() => {
      if (!pagination) return sortedData;
      
      const startIndex = (currentPage - 1) * pageSize;
      return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize, pagination]);
    
    // Manipulador de ordenação
    const handleSort = (columnIndex: number) => {
      if (!sortable) return;
      
      if (sortColumn === columnIndex) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortColumn(columnIndex);
        setSortDirection('asc');
      }
      
      // Anunciar para leitores de tela
      const columnName = headers[columnIndex];
      const direction = sortDirection === 'asc' ? 'descendente' : 'ascendente';
      announceToScreenReader(`Tabela ordenada por ${columnName} em ordem ${direction}`);
    };
    
    // Manipulador de navegação por teclado
    const { handleKeyDown } = useKeyboardNavigation({
      onArrowUp: (e) => {
        if (focusedCell && focusedCell.row > 0) {
          e.preventDefault();
          setFocusedCell({ ...focusedCell, row: focusedCell.row - 1 });
        }
      },
      onArrowDown: (e) => {
        if (focusedCell && focusedCell.row < paginatedData.length - 1) {
          e.preventDefault();
          setFocusedCell({ ...focusedCell, row: focusedCell.row + 1 });
        }
      },
      onArrowLeft: (e) => {
        if (focusedCell && focusedCell.col > 0) {
          e.preventDefault();
          setFocusedCell({ ...focusedCell, col: focusedCell.col - 1 });
        }
      },
      onArrowRight: (e) => {
        if (focusedCell && focusedCell.col < headers.length - 1) {
          e.preventDefault();
          setFocusedCell({ ...focusedCell, col: focusedCell.col + 1 });
        }
      },
      onHome: (e) => {
        if (focusedCell) {
          e.preventDefault();
          setFocusedCell({ ...focusedCell, col: 0 });
        }
      },
      onEnd: (e) => {
        if (focusedCell) {
          e.preventDefault();
          setFocusedCell({ ...focusedCell, col: headers.length - 1 });
        }
      },
      onCtrlHome: (e) => {
        e.preventDefault();
        setFocusedCell({ row: 0, col: 0 });
      },
      onCtrlEnd: (e) => {
        e.preventDefault();
        setFocusedCell({ row: paginatedData.length - 1, col: headers.length - 1 });
      },
      onEnter: (e) => {
        if (focusedCell && onRowClick) {
          e.preventDefault();
          onRowClick(focusedCell.row);
        }
      },
      onSpace: (e) => {
        if (focusedCell) {
          e.preventDefault();
          setExpandedRow(expandedRow === focusedCell.row ? null : focusedCell.row);
        }
      },
      preventDefault: true,
    });
    
    // Efeito para focar na célula selecionada
    useEffect(() => {
      if (focusedCell) {
        const cell = document.getElementById(`${tableId}-cell-${focusedCell.row}-${focusedCell.col}`);
        if (cell) {
          cell.focus();
          
          // Anunciar para leitores de tela
          const rowIndex = focusedCell.row + 1;
          const colName = headers[focusedCell.col];
          const cellValue = paginatedData[focusedCell.row][focusedCell.col];
          announceToScreenReader(`Linha ${rowIndex}, coluna ${colName}: ${cellValue}`);
        }
      }
    }, [focusedCell, tableId, headers, paginatedData, announceToScreenReader]);
    
    // Classes da tabela
    const tableClasses = cn(
      'w-full border-collapse',
      highContrastMode ? 'high-contrast-table' : 'border-gray-200',
      className
    );
    
    // Classes do cabeçalho
    const headerClasses = cn(
      'px-4 py-2 text-left font-medium text-sm',
      highContrastMode ? 'high-contrast-table-header' : 'bg-gray-100 text-gray-700'
    );
    
    // Classes das células
    const cellClasses = (rowIndex: number, isInteractive: boolean) => cn(
      'px-4 py-2 text-sm',
      isInteractive ? 'cursor-pointer' : '',
      rowIndex % 2 === 0
        ? highContrastMode ? 'high-contrast-table-row-even' : 'bg-white'
        : highContrastMode ? 'high-contrast-table-row-odd' : 'bg-gray-50',
      highlightedRow === rowIndex
        ? highContrastMode ? 'high-contrast-table-row-highlighted' : 'bg-blue-50'
        : '',
      focusedCell?.row === rowIndex
        ? highContrastMode ? 'high-contrast-table-row-focused' : 'bg-blue-100'
        : ''
    );
    
    // Classes dos botões de paginação
    const paginationButtonClasses = (isActive: boolean, isDisabled: boolean) => cn(
      'px-3 py-1 mx-1 rounded',
      isDisabled
        ? highContrastMode ? 'high-contrast-button-disabled' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : isActive
        ? highContrastMode ? 'high-contrast-button-active' : 'bg-blue-500 text-white'
        : highContrastMode ? 'high-contrast-button' : 'bg-white text-gray-700 hover:bg-gray-100'
    );
    
    return (
      <div className="overflow-x-auto">
        <table
          ref={ref}
          id={tableId}
          className={tableClasses}
          aria-labelledby={caption && !hideCaption ? captionId : undefined}
          aria-label={ariaLabel || (caption && hideCaption ? caption : undefined)}
          aria-describedby={ariaDescribedBy}
          role="grid"
          {...props}
        >
          {caption && !hideCaption && (
            <caption
              id={captionId}
              className={cn(
                'text-lg font-medium py-2',
                highContrastMode ? 'high-contrast-table-caption' : 'text-gray-900'
              )}
            >
              {caption}
            </caption>
          )}
          
          <thead className={highContrastMode ? 'high-contrast-table-head' : ''}>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={`header-${index}`}
                  className={cn(
                    headerClasses,
                    sortable ? 'cursor-pointer hover:bg-gray-200' : ''
                  )}
                  onClick={sortable ? () => handleSort(index) : undefined}
                  aria-sort={
                    sortColumn === index
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                  scope="col"
                  tabIndex={sortable ? 0 : -1}
                  role="columnheader"
                  aria-colindex={index + 1}
                >
                  <div className="flex items-center">
                    {header}
                    {sortable && sortColumn === index && (
                      <span className="ml-1" aria-hidden="true">
                        {sortDirection === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {rowActions && <th className={headerClasses} scope="col">Ações</th>}
            </tr>
          </thead>
          
          <tbody className={highContrastMode ? 'high-contrast-table-body' : ''}>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <React.Fragment key={`row-${rowIndex}`}>
                  <tr
                    className={cn(
                      onRowClick ? 'cursor-pointer hover:bg-gray-100' : '',
                      expandedRow === rowIndex ? 'border-b-0' : '',
                      highContrastMode && expandedRow === rowIndex ? 'high-contrast-table-row-expanded' : ''
                    )}
                    onClick={onRowClick ? () => onRowClick(rowIndex) : undefined}
                    aria-selected={highlightedRow === rowIndex ? 'true' : 'false'}
                    aria-expanded={expandedRow === rowIndex ? 'true' : 'false'}
                    role="row"
                    aria-rowindex={rowIndex + 1}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`cell-${rowIndex}-${cellIndex}`}
                        id={`${tableId}-cell-${rowIndex}-${cellIndex}`}
                        className={cellClasses(rowIndex, !!onRowClick)}
                        tabIndex={
                          focusedCell?.row === rowIndex && focusedCell?.col === cellIndex ? 0 : -1
                        }
                        onKeyDown={handleKeyDown}
                        role="gridcell"
                        aria-colindex={cellIndex + 1}
                        aria-rowindex={rowIndex + 1}
                      >
                        {cell}
                      </td>
                    ))}
                    {rowActions && (
                      <td className={cellClasses(rowIndex, false)}>
                        <div className="flex space-x-2">
                          {rowActions.map((action, actionIndex) => (
                            <div key={`action-${actionIndex}`}>{action}</div>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                  {expandedRow === rowIndex && (
                    <tr
                      className={cn(
                        highContrastMode ? 'high-contrast-table-row-details' : 'bg-gray-50'
                      )}
                    >
                      <td
                        colSpan={headers.length + (rowActions ? 1 : 0)}
                        className="px-4 py-2 text-sm"
                      >
                        <div className="p-2">
                          <h4 className="font-medium">Detalhes da linha {rowIndex + 1}</h4>
                          <dl className="grid grid-cols-2 gap-2 mt-2">
                            {headers.map((header, headerIndex) => (
                              <React.Fragment key={`detail-${headerIndex}`}>
                                <dt className="font-medium">{header}:</dt>
                                <dd>{row[headerIndex]}</dd>
                              </React.Fragment>
                            ))}
                          </dl>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length + (rowActions ? 1 : 0)}
                  className={cn(
                    'px-4 py-8 text-center text-sm',
                    highContrastMode ? 'high-contrast-table-empty' : 'text-gray-500'
                  )}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {pagination && totalPages > 1 && (
          <div
            className={cn(
              'flex justify-between items-center mt-4',
              highContrastMode ? 'high-contrast-pagination' : ''
            )}
            role="navigation"
            aria-label="Paginação da tabela"
          >
            <div className="text-sm text-gray-700">
              Mostrando {(currentPage - 1) * pageSize + 1} a{' '}
              {Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length} registros
            </div>
            
            <div className="flex">
              <button
                className={paginationButtonClasses(false, currentPage === 1)}
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                aria-label="Primeira página"
                aria-disabled={currentPage === 1 ? 'true' : 'false'}
              >
                &laquo;
              </button>
              <button
                className={paginationButtonClasses(false, currentPage === 1)}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                aria-disabled={currentPage === 1 ? 'true' : 'false'}
              >
                &lsaquo;
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = currentPage <= 3
                  ? i + 1
                  : currentPage >= totalPages - 2
                    ? totalPages - 4 + i
                    : currentPage - 2 + i;
                
                if (pageNumber <= 0 || pageNumber > totalPages) return null;
                
                return (
                  <button
                    key={`page-${pageNumber}`}
                    className={paginationButtonClasses(pageNumber === currentPage, false)}
                    onClick={() => setCurrentPage(pageNumber)}
                    aria-label={`Página ${pageNumber}`}
                    aria-current={pageNumber === currentPage ? 'page' : undefined}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                className={paginationButtonClasses(false, currentPage === totalPages)}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Próxima página"
                aria-disabled={currentPage === totalPages ? 'true' : 'false'}
              >
                &rsaquo;
              </button>
              <button
                className={paginationButtonClasses(false, currentPage === totalPages)}
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Última página"
                aria-disabled={currentPage === totalPages ? 'true' : 'false'}
              >
                &raquo;
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

AccessibleTable.displayName = 'AccessibleTable';

export default AccessibleTable;
