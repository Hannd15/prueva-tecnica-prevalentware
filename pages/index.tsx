import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

import { PageHeader } from '@/components/organisms/PageHeader';
import { HomeActionCards } from '@/components/organisms/HomeActionCards';
import { AppShell } from '@/components/templates/AppShell';
import { StatCard } from '@/components/molecules/StatCard';
import { formatCurrency } from '@/lib/utils';
import { type PaginatedMovementsResponse } from '@/types';

/**
 * Página de inicio (Dashboard).
 *
 * Presenta un resumen financiero rápido y accesos directos a las secciones principales.
 */
const Home = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['movements-summary'],
    queryFn: async () => {
      const res = await fetch('/api/movements?page=1&pageSize=1');
      if (!res.ok) throw new Error('Failed to fetch summary');
      return res.json() as Promise<PaginatedMovementsResponse>;
    },
  });

  const summary = data?.summary ?? {
    balance: 0,
    totalIncomes: 0,
    totalExpenses: 0,
  };

  return (
    <AppShell pageTitle='Dashboard' contentClassName='space-y-10'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <PageHeader
          title='Panel de Control'
          subtitle='Resumen general de tu actividad financiera.'
        />
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        <StatCard
          label='Balance Total'
          value={formatCurrency(summary.balance)}
          icon={<Wallet className='h-5 w-5' />}
          variant={summary.balance >= 0 ? 'success' : 'destructive'}
          isLoading={isLoading}
        />
        <StatCard
          label='Ingresos'
          value={formatCurrency(summary.totalIncomes)}
          icon={<TrendingUp className='h-5 w-5' />}
          variant='success'
          isLoading={isLoading}
        />
        <StatCard
          label='Egresos'
          value={formatCurrency(summary.totalExpenses)}
          icon={<TrendingDown className='h-5 w-5' />}
          variant='destructive'
          isLoading={isLoading}
        />
      </div>

      <div className='space-y-6'>
        <h2 className='text-lg font-semibold tracking-tight'>
          Accesos Directos
        </h2>
        <HomeActionCards />
      </div>
    </AppShell>
  );
};

export default Home;
