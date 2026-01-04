import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

export type LabeledDatePickerProps = {
  label: string;
  id: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  containerClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
};

export const LabeledDatePicker = ({
  label,
  id,
  date,
  setDate,
  containerClassName,
  labelClassName,
  disabled,
}: LabeledDatePickerProps) => (
  <div className={cn('space-y-2', containerClassName)}>
    <Label className={labelClassName} htmlFor={id}>
      {label}
    </Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
          disabled={disabled}
          id={id}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'dd/MM/yyyy') : <span>Seleccionar fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' side='top' align='start'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  </div>
);
