import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';

import { usePermissions } from '@/lib/rbac/client';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import {
  DataTable,
  type DataTableColumn,
} from '@/components/organisms/DataTable';
import { PageHeader } from '@/components/organisms/PageHeader';
import { AppShell } from '@/components/templates/AppShell';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency } from '@/lib/utils';
import {
  type MovementListItem,
  type PaginatedMovementsResponse,
} from '@/types';

import { NextPageAuth } from '@/pages/_app';

/**
 * Página de gestión de movimientos (ingresos/egresos).
 *
 * Muestra una tabla con los movimientos financieros y permite filtrar/paginar.
 */
const MovementsPage = () => {
  const router = useRouter();
  const { can } = usePermissions();

  const page = Number(router.query.page) || 1;
  const pageSize = Number(router.query.pageSize) || 10;

  const { data, isLoading } = useQuery({
    queryKey: ['movements', page, pageSize],
    queryFn: async () => {
      const res = await fetch(
        `/api/movements?page=${page}&pageSize=${pageSize}`
      );
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json() as Promise<PaginatedMovementsResponse>;
    },
  });

  const canCreate = can(PERMISSIONS.MOVEMENTS_CREATE);

  const columns: Array<DataTableColumn<MovementListItem>> = [
    {
      key: 'concept',
      header: 'Concepto',
      cell: (row) => (
        <div className='flex flex-col'>
          <span className='font-medium text-foreground'>{row.concept}</span>
          <span className='text-xs text-muted-foreground md:hidden'>
            {formatDate(row.date)}
          </span>
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Monto',
      headerClassName: 'text-right',
      className: 'text-right tabular-nums font-semibold',
      cell: (row) => (
        <span
          className={row.amount >= 0 ? 'text-emerald-600' : 'text-rose-600'}
        >
          {row.amount >= 0 ? '+' : ''}
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Fecha',
      className: 'hidden md:table-cell text-muted-foreground',
      cell: (row) => formatDate(row.date),
    },
    {
      key: 'user',
      header: 'Usuario',
      className: 'hidden lg:table-cell',
      cell: (row) => (
        <span className='text-sm text-muted-foreground'>
          {row.userName ?? 'Sistema'}
        </span>
      ),
    },
  ];

  const onPageChange = (page: number) => {
    void router.push({
      pathname: router.pathname,
      query: { ...router.query, page },
    });
  };

  const onPageSizeChange = (pageSize: number) => {
    void router.push({
      pathname: router.pathname,
      query: { ...router.query, pageSize, page: 1 },
    });
  };

  return (
    <AppShell pageTitle='Movimientos' contentClassName='space-y-8'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <PageHeader
          title='Movimientos'
          subtitle='Historial detallado de transacciones financieras.'
        />
        {canCreate && (
          <Button asChild className='w-full md:w-auto shadow-sm'>
            <Link href='/movements/new' className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              Nuevo Movimiento
            </Link>
          </Button>
        )}
      </div>

      <DataTable
        title='Transacciones'
        description='Listado de ingresos y egresos registrados en el sistema.'
        columns={columns}
        rows={data?.data ?? []}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        emptyMessage='No se encontraron movimientos.'
        pagination={
          data
            ? {
                ...data.meta,
                onPageChange,
                onPageSizeChange,
              }
            : undefined
        }
        footer={
          data ? (
            <div className='flex items-center justify-between w-full pt-4 border-t'>
              <span className='text-sm font-medium text-muted-foreground'>
                Balance Total
              </span>
              <span
                className={`text-xl font-bold tabular-nums ${
                  data.summary.balance >= 0
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }`}
              >
                {formatCurrency(data.summary.balance)}
              </span>
            </div>
          ) : null
        }
      />
    </AppShell>
  );
};

(MovementsPage as NextPageAuth).requiredPermissions = [
  PERMISSIONS.MOVEMENTS_READ,
];

export default MovementsPage;
