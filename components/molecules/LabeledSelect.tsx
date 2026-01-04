import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type LabeledSelectProps = {
  label: string;
  id: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  triggerClassName?: string;
};

export const LabeledSelect = ({
  label,
  id,
  options,
  value,
  onValueChange,
  placeholder,
  disabled,
  containerClassName,
  labelClassName,
  triggerClassName,
}: LabeledSelectProps) => (
  <div className={cn('space-y-2', containerClassName)}>
    <Label className={labelClassName} htmlFor={id}>
      {label}
    </Label>
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger id={id} className={triggerClassName}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
