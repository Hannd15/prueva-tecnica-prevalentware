import { MovementType } from '@prisma/client';

export type MovementListItem = {
  id: string;
  concept: string;
  amount: number;
  date: string;
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

export type UserWithRole = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  roleName: string;
};

export type PaginatedUsersResponse = {
  data: UserWithRole[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

export type Role = {
  id: string;
  name: string;
};

export type UserDetail = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  roleId: string;
};

export type HomeAction = {
  title: string;
  description: string;
  href: string;
  permission: string;
};
