import type { NextApiRequest, NextApiResponse } from 'next';
import { MovementType } from '@prisma/client';
import { getServerSession } from '@/lib/auth/server';
import { prisma } from '@/lib/db';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { getUserPermissionKeys } from '@/lib/rbac/server';

type ChartDataPoint = {
  date: string;
  incomes: number;
  expenses: number;
};

type ReportsStatsResponse = {
  summary: {
    totalIncomes: number;
    totalExpenses: number;
    balance: number;
  };
  chartData: ChartDataPoint[];
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReportsStatsResponse | ErrorResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const permissions = await getUserPermissionKeys(session.user.id);
  if (!permissions.includes(PERMISSIONS.REPORTS_READ)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    // 1. Get Summary Totals
    const summary = await prisma.movement.groupBy({
      by: ['type'],
      _sum: {
        amount: true,
      },
    });

    const totalIncomes =
      summary.find((s) => s.type === MovementType.INCOME)?._sum.amount ?? 0;
    const totalExpenses =
      summary.find((s) => s.type === MovementType.EXPENSE)?._sum.amount ?? 0;

    // 2. Get Chart Data (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const movements = await prisma.movement.findMany({
      where: {
        date: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Group by date in JS for simplicity and cross-DB compatibility
    const chartDataMap = new Map<string, ChartDataPoint>();

    // Initialize last 30 days
    for (let i = 0; i <= 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const [dateStr] = d.toISOString().split('T');
      chartDataMap.set(dateStr, { date: dateStr, incomes: 0, expenses: 0 });
    }

    movements.forEach((m) => {
      const [dateStr] = m.date.toISOString().split('T');
      const point = chartDataMap.get(dateStr);
      if (point) {
        if (m.type === MovementType.INCOME) {
          point.incomes += m.amount;
        } else {
          point.expenses += m.amount;
        }
      }
    });

    const chartData = Array.from(chartDataMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    return res.status(200).json({
      summary: {
        totalIncomes,
        totalExpenses,
        balance: totalIncomes - totalExpenses,
      },
      chartData,
    });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
