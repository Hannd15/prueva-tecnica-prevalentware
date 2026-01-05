import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Pantalla de carga global para transiciones de página.
 */
export const PageLoader = () => (
  <div className='fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300'>
    <div className='flex flex-col items-center gap-4'>
      <Loader2 className='h-10 w-10 animate-spin text-primary' />
      <p className='text-sm font-medium text-muted-foreground animate-pulse'>
        Cargando...
      </p>
    </div>
  </div>
);
