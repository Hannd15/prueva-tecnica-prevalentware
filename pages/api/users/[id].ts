import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '@/lib/auth/server';
import { prisma } from '@/lib/db';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { getUserPermissionKeys } from '@/lib/rbac/server';
import { UserDetail } from '@/types';

const userDetailSelect = {
  select: {
    id: true,
    name: true,
    email: true,
    phone: true,
    roleId: true,
  },
} as const;

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener usuario por ID
 *     description: Devuelve el detalle del usuario. Requiere permiso `USERS_EDIT`.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDetail'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   id: "user_1"
 *                   name: "Ada Lovelace"
 *                   email: "ada@example.com"
 *                   phone: "+57 300 000 0000"
 *                   roleId: "role_admin"
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
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ejemplo:
 *                 value: { error: "User not found" }
 *   patch:
 *     tags: [Users]
 *     summary: Actualizar usuario
 *     description: Actualiza campos editables del usuario. Requiere permiso `USERS_EDIT`.
 *     security:
 *       - cookieAuth: []
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
 *           examples:
 *             ejemplo:
 *               value:
 *                 name: "Grace Hopper"
 *                 roleId: "role_admin"
 *                 phone: "+57 300 111 1111"
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDetail'
 *       400:
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ejemplo:
 *                 value: { error: "Invalid ID" }
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
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
      ...userDetailSelect,
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
        ...userDetailSelect,
      });
      return res.status(200).json(updatedUser);
    } catch {
      return res.status(500).json({ error: 'Failed to update user' });
    }
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
