import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '@/lib/auth/server';
import { prisma } from '@/lib/db';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { getUserPermissionKeys } from '@/lib/rbac/server';
import { Role } from '@/types';

/**
 * @openapi
 * /api/roles:
 *   get:
 *     summary: Obtener roles
 *     responses:
 *       200:
 *         description: Lista de roles
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Sin permisos
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Role[] | { error: string }>
) {
  // Endpoint protegido: requiere sesión y permiso `USERS_EDIT`.
  const session = await getServerSession(req);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const permissions = await getUserPermissionKeys(session.user.id);
  if (!permissions.includes(PERMISSIONS.USERS_EDIT)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
    return res.status(200).json(roles);
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
