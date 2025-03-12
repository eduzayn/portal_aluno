'use client';

import React, { useEffect } from 'react';
import ServerErrorHandler from '../../components/ui/ServerErrorHandler';

export default function DemoPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Demo page error:', error);
  }, [error]);

  return (
    <ServerErrorHandler 
      error={error} 
      reset={reset} 
      module="student" 
    />
  );
}
