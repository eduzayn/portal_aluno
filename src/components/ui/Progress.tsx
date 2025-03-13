'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { colors } from '../../styles/colors';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, module = 'student', ...props }, ref) => {
    const moduleColor = colors.primary[module];
    const percent = value !== undefined ? Math.min(Math.max(0, value), max) : 0;
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-neutral-200",
          className
        )}
        {...props}
      >
        <div
          className="h-full w-full flex-1 transition-all"
          style={{
            width: `${(percent / max) * 100}%`,
            backgroundColor: moduleColor.main,
          }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
