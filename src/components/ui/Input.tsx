'use client';

import React from 'react';
import { cn } from './utils';
import { colors } from './colors';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, module = 'enrollment', type, ...props }, ref) => {
    const moduleColor = colors.primary[module];
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{
          '--tw-ring-color': moduleColor.light,
        } as React.CSSProperties}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
