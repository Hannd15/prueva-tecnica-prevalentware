import type { ComponentProps } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type LabeledInputProps = {
  label: string;
  /**
   * id is required to associate the <label> with the input.
   */
  id: string;
  containerClassName?: string;
  labelClassName?: string;
} & ComponentProps<typeof Input>;

export const LabeledInput = ({
  label,
  id,
  containerClassName,
  labelClassName,
  className,
  ...inputProps
}: LabeledInputProps) => (
  <div className={cn('space-y-2', containerClassName)}>
    <label className={cn('text-sm font-medium', labelClassName)} htmlFor={id}>
      {label}
    </label>
    <Input id={id} className={className} {...inputProps} />
  </div>
);
