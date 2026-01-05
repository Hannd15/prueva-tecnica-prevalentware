import { TitledCard } from '@/components/molecules/TitledCard';
import { MovementsChart } from '@/components/organisms/MovementsChart';
import { Skeleton } from '@/components/ui/skeleton';

type ChartDataPoint = {
  date: string;
  incomes: number;
  expenses: number;
};

/**
 * Sección de gráfico para reportes.
 *
 * Encapsula el contenedor y el estado de carga del gráfico de movimientos.
 * Utiliza Skeletons para una carga visualmente fluida.
 */
export const ReportsChartSection = ({
  data,
  isLoading,
}: {
  data: { chartData: ChartDataPoint[] } | null;
  isLoading: boolean;
}) => (
  <TitledCard
    title='Tendencia de Flujo de Caja'
    description='Visualización del balance neto diario de ingresos y egresos.'
    className='flex-1'
  >
    <div className='h-[400px] w-full pt-6'>
      {isLoading ? (
        <div className='h-full w-full space-y-4'>
          <div className='flex h-[300px] w-full items-end gap-2'>
            {[
              'b1',
              'b2',
              'b3',
              'b4',
              'b5',
              'b6',
              'b7',
              'b8',
              'b9',
              'b10',
              'b11',
              'b12',
            ].map((id) => (
              <Skeleton
                key={id}
                className='w-full'
                style={{ height: `${Math.random() * 60 + 20}%` }}
              />
            ))}
          </div>
          <div className='flex w-full justify-between'>
            {['l1', 'l2', 'l3', 'l4', 'l5', 'l6'].map((id) => (
              <Skeleton key={id} className='h-3 w-12' />
            ))}
          </div>
        </div>
      ) : (
        <MovementsChart data={data?.chartData ?? []} />
      )}
    </div>
  </TitledCard>
);
