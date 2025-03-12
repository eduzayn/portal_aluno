'use client';

import React from 'react';
import { cn } from './utils';
import { colors } from './colors';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, module = 'enrollment', ...props }, ref) => {
    return (
      <div className="w-full overflow-auto">
        <table
          ref={ref}
          className={cn("w-full caption-bottom text-sm", className)}
          {...props}
        />
      </div>
    );
  }
);
Table.displayName = "Table";

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, module = 'enrollment', ...props }, ref) => {
    return (
      <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
    );
  }
);
TableHeader.displayName = "TableHeader";

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, module = 'enrollment', ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
      />
    );
  }
);
TableBody.displayName = "TableBody";

interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, module = 'enrollment', ...props }, ref) => {
    return (
      <tfoot
        ref={ref}
        className={cn("bg-neutral-50 font-medium", className)}
        {...props}
      />
    );
  }
);
TableFooter.displayName = "TableFooter";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, module = 'enrollment', ...props }, ref) => {
    const moduleColor = colors.primary[module];
    
    return (
      <tr
        ref={ref}
        className={cn(
          "border-b transition-colors hover:bg-neutral-50 data-[state=selected]:bg-neutral-100",
          className
        )}
        style={{
          '--hover-color': `${moduleColor.light}10`, // 10% opacity
        } as React.CSSProperties}
        {...props}
      />
    );
  }
);
TableRow.displayName = "TableRow";

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, module = 'enrollment', ...props }, ref) => {
    const moduleColor = colors.primary[module];
    
    return (
      <th
        ref={ref}
        className={cn(
          "h-12 px-4 text-left align-middle font-medium text-neutral-500",
          className
        )}
        style={{
          color: moduleColor.dark,
        }}
        {...props}
      />
    );
  }
);
TableHead.displayName = "TableHead";

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, module = 'enrollment', ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn("p-4 align-middle", className)}
        {...props}
      />
    );
  }
);
TableCell.displayName = "TableCell";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
};
