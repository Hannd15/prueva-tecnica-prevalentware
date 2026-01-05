import type { NextApiRequest, NextApiResponse } from 'next';
import { MovementType } from '@prisma/client';
import { getServerSession } from '@/lib/auth/server';
import { prisma } from '@/lib/db';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { getUserPermissionKeys } from '@/lib/rbac/server';
import { formatDate } from '@/lib/utils';

/**
 * @openapi
 * /api/reports/export:
 *   get:
 *     tags: [Reports]
 *     summary: Exportar movimientos a CSV
 *     description: Descarga un CSV con todos los movimientos. Requiere permiso `REPORTS_READ`.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Archivo CSV
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *             examples:
 *               ejemplo:
 *                 summary: Contenido CSV (primeras líneas)
 *                 value: "Fecha,Concepto,Tipo,Monto,Usuario\n2026-01-04,\"Compra\",Egreso,150,Ada Lovelace"
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
  res: NextApiResponse
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
    const movements = await prisma.movement.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Encabezado CSV
    const headers = ['Fecha', 'Concepto', 'Tipo', 'Monto', 'Usuario'];

    // Filas CSV
    const rows = movements.map((m) => [
      formatDate(m.date),
      `"${m.concept.replace(/"/g, '""')}"`, // Escapamos comillas dobles
      m.type === MovementType.INCOME ? 'Ingreso' : 'Egreso',
      m.amount.toString(),
      m.user?.name ?? '-',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    // Headers para forzar descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-movimientos-${new Date().toISOString().split('T')[0]}.csv`
    );

    return res.status(200).send(csvContent);
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
