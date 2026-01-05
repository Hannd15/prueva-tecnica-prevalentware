import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '@/lib/auth/server';
import { prisma } from '@/lib/db';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { getUserPermissionKeys } from '@/lib/rbac/server';
import { PaginatedUsersResponse } from '@/types';

const parseNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Obtener usuarios (paginado)
 *     description: Lista paginada de usuarios. Requiere permiso `USERS_READ`.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedUsersResponse'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   data:
 *                     - id: "user_1"
 *                       name: "Ada Lovelace"
 *                       email: "ada@example.com"
 *                       phone: "+57 300 000 0000"
 *                       roleName: "ADMIN"
 *                   meta:
 *                     total: 1
 *                     page: 1
 *                     pageSize: 10
 *                     totalPages: 1
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ejemplo:
 *                 value: { error: "Unauthorized" }
 *       403:
 *         description: Sin permisos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ejemplo:
 *                 value: { error: "Forbidden" }
 *       405:
 *         description: Método no permitido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Endpoint protegido: requiere sesión y permiso `USERS_READ`.
  const session = await getServerSession(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const permissions = await getUserPermissionKeys(session.user.id);
  if (!permissions.includes(PERMISSIONS.USERS_READ)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    const page = Math.max(1, parseNumber(req.query.page) ?? 1);
    const pageSize = Math.max(1, parseNumber(req.query.pageSize) ?? 10);

    const [total, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        include: {
          role: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    const response: PaginatedUsersResponse = {
      data: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        roleName: u.role.name,
      })),
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    return res.status(200).json(response);
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
