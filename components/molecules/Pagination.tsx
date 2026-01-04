import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type PaginationProps = {
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
};

/**
 * Reusable pagination molecule.
 *
 * Combines page size selection and navigation controls.
 */
export const Pagination = ({
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  className,
}: PaginationProps) => (
  <div
    className={cn(
      'flex items-center justify-between border-t p-4 bg-background',
      className
    )}
  >
    <div className='flex items-center gap-2'>
      <span className='text-sm text-muted-foreground'>Filas por página</span>
      <Select
        value={String(pageSize)}
        onValueChange={(val) => onPageSizeChange(Number(val))}
      >
        <SelectTrigger className='h-8 w-[70px]'>
          <SelectValue placeholder={pageSize} />
        </SelectTrigger>
        <SelectContent side='top'>
          {pageSizeOptions.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className='flex items-center gap-6 lg:gap-8'>
      <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
        Página {page} de {totalPages || 1}
      </div>
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <span className='sr-only'>Página anterior</span>
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <span className='sr-only'>Página siguiente</span>
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  </div>
);
