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
  className?: string;
};

/**
 * Generic data table.
 *
 * - Uses Shadcn Table + Card.
 * - Accepts columns/row configuration so it can be reused across features.
 * - Renders optional `actions` inside the table card header (e.g. Create button).
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
  className,
}: DataTableProps<Row>) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='flex flex-1 items-center justify-center text-sm text-muted-foreground'>
          Cargando...
        </div>
      );
    }

    if (error) {
      return (
        <div className='flex flex-1 items-center justify-center text-sm text-destructive'>
          {error}
        </div>
      );
    }

    return (
      <Table containerClassName='flex-1'>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  'sticky top-0 z-10 bg-background shadow-[0_1px_0_0_rgba(0,0,0,0.1)]',
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
                className='h-24 text-center text-muted-foreground'
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={getRowKey(row)}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
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
      className={cn('flex flex-col overflow-hidden', className)}
      contentClassName='flex flex-1 flex-col overflow-hidden p-0'
    >
      {renderContent()}

      {pagination && <Pagination {...pagination} />}
    </TitledCard>
  );
};
