import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { StatCard } from '@/components/molecules/StatCard';
import { formatCurrency } from '@/lib/utils';

type ReportsStats = {
  summary: {
    totalIncomes: number;
    totalExpenses: number;
    balance: number;
  };
};

export const ReportsStatsGrid = ({
  data,
  isLoading,
}: {
  data: ReportsStats | null;
  isLoading: boolean;
}) => (
  <div className='grid grid-cols-3 gap-6'>
    <StatCard
      label='Total Ingresos'
      value={formatCurrency(data?.summary.totalIncomes ?? 0)}
      icon={<TrendingUp className='h-4 w-4 text-green-600' />}
      variant='success'
      isLoading={isLoading}
    />
    <StatCard
      label='Total Egresos'
      value={formatCurrency(data?.summary.totalExpenses ?? 0)}
      icon={<TrendingDown className='h-4 w-4 text-red-600' />}
      variant='destructive'
      isLoading={isLoading}
    />
    <StatCard
      label='Saldo Actual'
      value={formatCurrency(data?.summary.balance ?? 0)}
      icon={<Wallet className='h-4 w-4' />}
      variant={(data?.summary.balance ?? 0) >= 0 ? 'success' : 'destructive'}
      isLoading={isLoading}
    />
  </div>
);
