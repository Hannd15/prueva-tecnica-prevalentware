import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
};

/**
 * Encabezado genérico de página.
 *
 * Se usa en distintas rutas para mantener los pages enfocados en la composición.
 */
export const PageHeader = ({
  title,
  subtitle,
  actions,
  className,
}: PageHeaderProps) => (
  <header className={cn('flex items-start justify-between', className)}>
    <div className='space-y-2'>
      <h1 className='text-3xl font-semibold tracking-tight'>{title}</h1>
      {subtitle ? <p className='text-muted-foreground'>{subtitle}</p> : null}
    </div>
    {actions ? <div className='shrink-0'>{actions}</div> : null}
  </header>
);
