'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { colors } from './colors';

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-white text-neutral-900 border-neutral-200",
        primary: "",
        success: "",
        warning: "",
        error: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, module = 'enrollment', ...props }, ref) => {
    const moduleColor = colors.primary[module];
    const style: React.CSSProperties = {};
    
    if (variant === 'primary') {
      style.backgroundColor = `${moduleColor.light}10`; // 10% opacity
      style.borderColor = moduleColor.light;
    } else if (variant === 'success') {
      style.backgroundColor = `${colors.semantic.success}10`; // 10% opacity
      style.borderColor = colors.semantic.success;
    } else if (variant === 'warning') {
      style.backgroundColor = `${colors.semantic.warning}10`; // 10% opacity
      style.borderColor = colors.semantic.warning;
    } else if (variant === 'error') {
      style.backgroundColor = `${colors.semantic.error}10`; // 10% opacity
      style.borderColor = colors.semantic.error;
    }
    
    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant }), className)}
        style={style}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  module?: 'communication' | 'student' | 'content' | 'enrollment';
}

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, module = 'enrollment', ...props }, ref) => {
    const moduleColor = colors.primary[module];
    
    return (
      <h5
        ref={ref}
        className={cn("mb-1 font-medium leading-none tracking-tight", className)}
        {...props}
      />
    );
  }
);
AlertTitle.displayName = "AlertTitle";

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-sm [&_p]:leading-relaxed", className)}
        {...props}
      />
    );
  }
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
