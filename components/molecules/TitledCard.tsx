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
 * Card wrapper with a consistent header (title/description/actions).
 *
 * Uses Shadcn Card primitives internally.
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
  <Card className={className}>
    <CardHeader className={headerClassName}>
      <div className='flex items-start justify-between gap-6'>
        <div>
          <CardTitle className={titleClassName}>{title}</CardTitle>
          {description ? (
            <CardDescription className={descriptionClassName}>
              {description}
            </CardDescription>
          ) : null}
        </div>
        {actions ? <div className='shrink-0'>{actions}</div> : null}
      </div>
    </CardHeader>

    {children ? (
      <CardContent className={cn('pt-0', contentClassName)}>
        {children}
      </CardContent>
    ) : null}
  </Card>
);
