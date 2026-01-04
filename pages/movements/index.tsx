import Link from 'next/link';
import { useEffect, useState } from 'react';

import { usePermissions } from '@/lib/rbac/client';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import {
  DataTable,
  type DataTableColumn,
} from '@/components/organisms/DataTable';
import { PageHeader } from '@/components/organisms/PageHeader';
import { AppShell } from '@/components/templates/AppShell';
import { Button } from '@/components/ui/button';

type MovementListItem = {
  id: string;
  concept: string;
  amount: number;
  date: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

/**
 * Movements management page (income/expenses).
 *
 * NOTE: Authentication/RBAC intentionally skipped for now (per request).
 */
const MovementsPage = () => {
  const [data, setData] = useState<MovementListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { can } = usePermissions();

  const canCreate = can(PERMISSIONS.MOVEMENTS_CREATE);

  const columns: Array<DataTableColumn<MovementListItem>> = [
    {
      key: 'concept',
      header: 'Concepto',
      cell: (row) => <span className='font-medium'>{row.concept}</span>,
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
      cell: (row) => (row.user ? `${row.user.name} (${row.user.email})` : '-'),
    },
  ];

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/movements', {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(
            body?.error ?? `Error al cargar movimientos (${res.status})`
          );
        }

        const json = (await res.json()) as MovementListItem[];
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Error desconocido');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell pageTitle='Gestión de ingresos y gastos'>
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
        rows={data}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        error={error}
        emptyMessage='No hay movimientos aún.'
      />
    </AppShell>
  );
};

(
  MovementsPage as typeof MovementsPage & { requiredPermissions?: string[] }
).requiredPermissions = [PERMISSIONS.MOVEMENTS_READ];

export default MovementsPage;
