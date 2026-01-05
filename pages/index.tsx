import { useQuery } from '@tanstack/react-query';

import { PageHeader } from '@/components/organisms/PageHeader';
import { HomeActionCards } from '@/components/organisms/HomeActionCards';
import { AppShell } from '@/components/templates/AppShell';
import { FinancialSummaryGrid } from '@/components/organisms/FinancialSummaryGrid';
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

  return (
    <AppShell pageTitle='Dashboard' contentClassName='space-y-10'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <PageHeader
          title='Panel de Control'
          subtitle='Resumen general de tu actividad financiera.'
        />
      </div>

      <FinancialSummaryGrid summary={data?.summary} isLoading={isLoading} />

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
