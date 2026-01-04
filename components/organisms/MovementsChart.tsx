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

export const MovementsChart = ({ data }: MovementsChartProps) => {
  const chartData = data.map((d) => ({
    ...d,
    net: d.incomes - d.expenses,
  }));

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart data={chartData}>
        <CartesianGrid
          strokeDasharray='3 3'
          vertical={false}
          stroke='#e5e7eb'
        />
        <XAxis
          dataKey='date'
          tickFormatter={(str) => {
            const formatted = formatDate(str);
            const [day, month] = formatted.split('/');
            return `${day}/${month}`;
          }}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <Tooltip
          labelFormatter={(label) => formatDate(label)}
          formatter={(value: number | string | undefined) => [
            formatCurrency(Number(value ?? 0)),
            'Neto',
          ]}
        />
        <ReferenceLine y={0} stroke='#000' />
        <Bar dataKey='net' name='Neto'>
          {chartData.map((entry) => (
            <Cell
              key={`cell-${entry.date}`}
              fill={entry.net >= 0 ? '#16a34a' : '#dc2626'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
