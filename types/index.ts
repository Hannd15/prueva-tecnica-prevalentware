import { MovementType } from '@prisma/client';

export type MovementListItem = {
  id: string;
  concept: string;
  amount: number;
  date: string;
  type: MovementType;
  userName: string | null;
};

export type PaginatedMovementsResponse = {
  data: MovementListItem[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  summary: {
    totalIncomes: number;
    totalExpenses: number;
    balance: number;
  };
};

export type ChartDataPoint = {
  date: string;
  incomes: number;
  expenses: number;
};

export type ReportsStats = {
  summary: {
    totalIncomes: number;
    totalExpenses: number;
    balance: number;
  };
  chartData: ChartDataPoint[];
};
