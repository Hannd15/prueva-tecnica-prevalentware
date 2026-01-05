import type { ReactNode } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type TitledCardProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
};

/**
 * Wrapper de tarjeta con encabezado consistente.
 * Diseño minimalista con bordes sutiles y tipografía clara.
 */
export const TitledCard = ({
  title,
  description,
  actions,
  children,
  className,
  headerClassName,
  titleClassName,
  descriptionClassName,
  contentClassName,
}: TitledCardProps) => (
  <Card className={cn('shadow-none border-border/60 bg-card', className)}>
    <CardHeader className={cn('px-6 py-5', headerClassName)}>
      <div className='flex items-start justify-between gap-4'>
        <div className='space-y-1'>
          <CardTitle
            className={cn(
              'text-base font-semibold tracking-tight',
              titleClassName
            )}
          >
            {title}
          </CardTitle>
          {description ? (
            <CardDescription
              className={cn(
                'text-sm text-muted-foreground/80',
                descriptionClassName
              )}
            >
              {description}
            </CardDescription>
          ) : null}
        </div>
        {actions ? <div className='shrink-0'>{actions}</div> : null}
      </div>
    </CardHeader>

    {children ? (
      <CardContent className={cn('px-6 pb-6 pt-0', contentClassName)}>
        {children}
      </CardContent>
    ) : null}
  </Card>
);
