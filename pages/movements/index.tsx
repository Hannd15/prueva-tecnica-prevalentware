import Link from 'next/link';
import { MovementType } from '@prisma/client';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

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

/**
 * Página de gestión de movimientos (ingresos/egresos).
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
      cell: (row) => <span className='font-medium'>{row.concept}</span>,
    },
    {
      key: 'type',
      header: 'Tipo',
      cell: (row) => (
        <span
          className={
            row.type === MovementType.INCOME
              ? 'text-green-600 font-medium'
              : 'text-red-600 font-medium'
          }
        >
          {row.type === MovementType.INCOME ? 'Ingreso' : 'Egreso'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Monto',
      headerClassName: 'text-right',
      className: 'text-right',
      cell: (row) => formatCurrency(row.amount),
    },
    {
      key: 'date',
      header: 'Fecha',
      cell: (row) => formatDate(row.date),
    },
    {
      key: 'user',
      header: 'Usuario',
      cell: (row) => row.userName ?? '-',
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
    <AppShell
      pageTitle='Gestión de ingresos y gastos'
      contentClassName='space-y-6'
    >
      <PageHeader
        title='Gestión de ingresos y gastos'
        subtitle='Consulta y registra movimientos financieros.'
      />

      <DataTable
        title='Movimientos'
        description='Listado de ingresos y egresos registrados.'
        actions={
          canCreate ? (
            <Button asChild>
              <Link href='/movements/new'>Nuevo</Link>
            </Button>
          ) : null
        }
        columns={columns}
        rows={data?.data ?? []}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        emptyMessage='No hay movimientos aún.'
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
            <div className='flex items-center gap-2 text-lg font-bold'>
              <span>Total:</span>
              <span
                className={
                  data.summary.balance >= 0 ? 'text-green-600' : 'text-red-600'
                }
              >
                {formatCurrency(data.summary.balance)}
              </span>
            </div>
          ) : null
        }
        className='flex-1 min-h-0'
      />
    </AppShell>
  );
};

(
  MovementsPage as typeof MovementsPage & { requiredPermissions?: string[] }
).requiredPermissions = [PERMISSIONS.MOVEMENTS_READ];

export default MovementsPage;
