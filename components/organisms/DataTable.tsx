import type { ReactNode } from 'react';

import {
  Pagination,
  type PaginationProps,
} from '@/components/molecules/Pagination';
import { TitledCard } from '@/components/molecules/TitledCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type DataTableColumn<Row> = {
  key: string;
  header: ReactNode;
  cell: (row: Row) => ReactNode;
  className?: string;
  headerClassName?: string;
};

export type DataTableProps<Row> = {
  title: string;
  description?: string;
  actions?: ReactNode;
  columns: Array<DataTableColumn<Row>>;
  rows: Row[];
  getRowKey: (row: Row) => string;
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  pagination?: PaginationProps;
  footer?: ReactNode;
  className?: string;
};

/**
 * Tabla de datos profesional.
 * Diseño "airy" con tipografía optimizada y estados de carga refinados.
 */
export const DataTable = <Row,>({
  title,
  description,
  actions,
  columns,
  rows,
  getRowKey,
  isLoading = false,
  error = null,
  emptyMessage = 'No hay registros.',
  pagination,
  footer,
  className,
}: DataTableProps<Row>) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='p-6 space-y-4'>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className='h-12 w-full rounded-lg' />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className='flex flex-1 items-center justify-center p-12 text-sm text-destructive bg-destructive/5'>
          {error}
        </div>
      );
    }

    return (
      <Table containerClassName='flex-1'>
        <TableHeader>
          <TableRow className='hover:bg-transparent border-b border-border/40'>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  'h-12 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground/70',
                  column.headerClassName
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='h-32 text-center text-muted-foreground italic'
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={getRowKey(row)}
                className='group transition-colors hover:bg-slate-50/80 border-b border-border/40 last:border-0'
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      'px-6 py-4 text-sm tabular-nums',
                      column.className
                    )}
                  >
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <TitledCard
      title={title}
      description={description}
      actions={actions}
      className={cn(
        'flex flex-col overflow-hidden border-border/40',
        className
      )}
      contentClassName='flex flex-1 flex-col overflow-hidden p-0'
    >
      {renderContent()}

      {pagination && (
        <div className='border-t border-border/40 bg-slate-50/30'>
          <Pagination {...pagination} />
        </div>
      )}

      {footer && (
        <div className='flex justify-end border-t border-border/40 bg-slate-50/50 p-4'>
          {footer}
        </div>
      )}
    </TitledCard>
  );
};
