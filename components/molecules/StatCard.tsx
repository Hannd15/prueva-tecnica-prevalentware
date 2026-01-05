import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TitledCard } from './TitledCard';

export type StatCardProps = {
  label: string;
  value: number | string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'destructive';
  isLoading?: boolean;
  className?: string;
};

/**
 * Tarjeta especializada para mostrar métricas financieras.
 * Utiliza tabular-nums para asegurar alineación de cifras.
 */
export const StatCard = ({
  label,
  value,
  icon,
  variant = 'default',
  isLoading = false,
  className,
}: StatCardProps) => {
  const variantClasses = {
    default: 'text-foreground',
    success: 'text-emerald-600',
    destructive: 'text-rose-600',
  };

  return (
    <TitledCard
      title={label}
      titleClassName='text-xs font-bold uppercase tracking-wider text-muted-foreground/70'
      className={cn(
        'relative overflow-hidden transition-all hover:border-border/80',
        className
      )}
      actions={
        icon && (
          <div className='p-2 bg-muted/50 rounded-lg text-muted-foreground'>
            {icon}
          </div>
        )
      }
    >
      <div
        className={cn(
          'text-3xl font-bold tracking-tight tabular-nums',
          variantClasses[variant]
        )}
      >
        {isLoading ? (
          <div className='h-9 w-32 animate-pulse rounded-md bg-muted/60' />
        ) : (
          value
        )}
      </div>
    </TitledCard>
  );
};
