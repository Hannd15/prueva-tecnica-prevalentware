import type { ReactNode } from 'react';

import { TitledCard } from '@/components/molecules/TitledCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
}: DataTableProps<Row>) => {
  if (isLoading) {
    return (
      <TitledCard title={title} description={description} actions={actions}>
        <div className='text-sm text-muted-foreground'>Cargando...</div>
      </TitledCard>
    );
  }

  if (error) {
    return (
      <TitledCard title={title} description={description} actions={actions}>
        <div className='text-sm text-destructive'>{error}</div>
      </TitledCard>
    );
  }

  return (
    <TitledCard title={title} description={description} actions={actions}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.headerClassName}>
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
                className='text-muted-foreground'
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
    </TitledCard>
  );
};
