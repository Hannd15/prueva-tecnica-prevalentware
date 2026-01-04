import { TitledCard } from '@/components/molecules/TitledCard';
import { MovementsChart } from '@/components/organisms/MovementsChart';

type ChartDataPoint = {
  date: string;
  incomes: number;
  expenses: number;
};

export const ReportsChartSection = ({
  data,
  isLoading,
}: {
  data: { chartData: ChartDataPoint[] } | null;
  isLoading: boolean;
}) => (
  <TitledCard title='Movimientos en el tiempo' className='flex-1 min-h-[400px]'>
    <div className='h-[350px] w-full pt-4'>
      {isLoading ? (
        <div className='flex h-full items-center justify-center text-muted-foreground'>
          Cargando gráfico...
        </div>
      ) : (
        <MovementsChart data={data?.chartData ?? []} />
      )}
    </div>
  </TitledCard>
);
