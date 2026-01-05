import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '@/lib/auth/server';
import { prisma } from '@/lib/db';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { getUserPermissionKeys } from '@/lib/rbac/server';
import { UserDetail } from '@/types';

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle del usuario
 *       404:
 *         description: Usuario no encontrado
 *   patch:
 *     summary: Actualizar usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               roleId:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Solicitud inválida
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserDetail | { error: string }>
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

  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(user);
  }

  if (req.method === 'PATCH') {
    const { name, roleId, phone } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name,
          roleId,
          phone,
        },
        include: { role: true },
      });
      return res.status(200).json(updatedUser);
    } catch {
      return res.status(500).json({ error: 'Failed to update user' });
    }
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
