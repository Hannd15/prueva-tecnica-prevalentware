import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatDate, formatCurrency } from '@/lib/utils';

type ChartDataPoint = {
  date: string;
  incomes: number;
  expenses: number;
};

type MovementsChartProps = {
  data: ChartDataPoint[];
};

/**
 * Gráfico de movimientos (neto) en el tiempo.
 *
 * Calcula `net = ingresos - egresos` y colorea las barras según el signo.
 * Utiliza una estética minimalista y profesional.
 */
export const MovementsChart = ({ data }: MovementsChartProps) => {
  const chartData = data.map((d) => ({
    ...d,
    net: d.incomes - d.expenses,
  }));

  return (
    <div className='w-full h-full min-h-[300px]'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray='3 3'
            vertical={false}
            stroke='hsl(var(--muted))'
            opacity={0.4}
          />
          <XAxis
            dataKey='date'
            tickFormatter={(str) => {
              const date = new Date(str);
              return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
              });
            }}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            dy={10}
          />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) =>
              `$${Math.abs(value) >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`
            }
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--secondary))', opacity: 0.4 }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length && label) {
                const value = payload[0].value as number;
                return (
                  <div className='rounded-lg border bg-background p-3 shadow-md'>
                    <p className='text-xs font-medium text-muted-foreground mb-1'>
                      {formatDate(label)}
                    </p>
                    <p
                      className={`text-sm font-bold tabular-nums ${
                        value >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {formatCurrency(value)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine
            y={0}
            stroke='hsl(var(--muted-foreground))'
            strokeOpacity={0.2}
          />
          <Bar dataKey='net' name='Neto' radius={[4, 4, 0, 0]} barSize={32}>
            {chartData.map((entry) => (
              <Cell
                key={entry.date}
                fill={
                  entry.net >= 0
                    ? 'hsl(var(--primary))'
                    : 'hsl(var(--destructive))'
                }
                fillOpacity={0.8}
                className='transition-opacity duration-200 hover:opacity-100'
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
