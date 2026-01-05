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
 * Tarjeta especializada para mostrar métricas.
 *
 * - Soporta variantes para datos financieros (éxito/destructivo).
 * - Incluye estado de carga integrado.
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
    success: 'text-green-600',
    destructive: 'text-red-600',
  };

  return (
    <TitledCard
      title={label}
      titleClassName='text-sm font-medium text-muted-foreground'
      className={cn('overflow-hidden', className)}
      actions={icon && <div className='text-muted-foreground'>{icon}</div>}
    >
      <div className={cn('text-2xl font-bold', variantClasses[variant])}>
        {isLoading ? (
          <div className='h-8 w-24 animate-pulse rounded bg-muted' />
        ) : (
          value
        )}
      </div>
    </TitledCard>
  );
};
