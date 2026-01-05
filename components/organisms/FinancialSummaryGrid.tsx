import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { StatCard } from '@/components/molecules/StatCard';
import { formatCurrency } from '@/lib/utils';

type SummaryData = {
  totalIncomes: number;
  totalExpenses: number;
  balance: number;
};

/**
 * Grid de métricas financieras principales.
 *
 * Muestra ingresos, egresos y saldo con una disposición responsiva.
 */
export const FinancialSummaryGrid = ({
  summary,
  isLoading,
}: {
  summary?: SummaryData;
  isLoading: boolean;
}) => (
  <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
    <StatCard
      label='Balance total'
      value={formatCurrency(summary?.balance ?? 0)}
      icon={<Wallet className='h-5 w-5' />}
      variant={(summary?.balance ?? 0) >= 0 ? 'success' : 'destructive'}
      isLoading={isLoading}
    />
    <StatCard
      label='Total Ingresos'
      value={formatCurrency(summary?.totalIncomes ?? 0)}
      icon={<TrendingUp className='h-5 w-5' />}
      variant='success'
      isLoading={isLoading}
    />
    <StatCard
      label='Total Egresos'
      value={formatCurrency(summary?.totalExpenses ?? 0)}
      icon={<TrendingDown className='h-5 w-5' />}
      variant='destructive'
      isLoading={isLoading}
    />
  </div>
);
