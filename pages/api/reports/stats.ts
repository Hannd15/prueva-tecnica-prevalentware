import type { NextApiRequest, NextApiResponse } from 'next';
import { MovementType } from '@prisma/client';

import { getServerSession } from '@/lib/auth/server';
import { prisma } from '@/lib/db';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { getUserPermissionKeys } from '@/lib/rbac/server';
import { type ChartDataPoint, type ReportsStats } from '@/types';

type ErrorResponse = {
  error: string;
};

/**
 * @openapi
 * /api/reports/stats:
 *   get:
 *     tags: [Reports]
 *     summary: Obtener estadísticas financieras y datos para el gráfico
 *     description: Devuelve totales (ingresos/egresos/balance) y puntos del gráfico (últimos 30 días). Requiere permiso `REPORTS_READ`.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Datos de estadísticas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportsStats'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   summary:
 *                     totalIncomes: 2500
 *                     totalExpenses: 300
 *                     balance: 2200
 *                   chartData:
 *                     - date: "2026-01-03"
 *                       incomes: 2500
 *                       expenses: 0
 *                     - date: "2026-01-04"
 *                       incomes: 0
 *                       expenses: 300
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       405:
 *         description: Método no permitido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReportsStats | ErrorResponse>
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
    // 1) Totales agregados (ingresos/egresos)
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

    // 2) Datos del gráfico (últimos 30 días)
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

    // Agrupamos por fecha en JS por simplicidad y compatibilidad entre DBs.
    const chartDataMap = new Map<string, ChartDataPoint>();

    // Inicializamos los últimos 30 días para que el gráfico no tenga huecos.
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

    const stats: ReportsStats = {
      summary: {
        totalIncomes,
        totalExpenses,
        balance: totalIncomes - totalExpenses,
      },
      chartData,
    };

    return res.status(200).json(stats);
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
