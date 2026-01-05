import type { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from '@/lib/auth/server';
import { getUserPermissionKeys } from '@/lib/rbac/server';

type ResponseBody =
  | { permissions: string[] }
  | {
      error: string;
    };

/**
 * @openapi
 * /api/me/permissions:
 *   get:
 *     tags: [Me]
 *     summary: Obtener permisos del usuario autenticado
 *     description: Devuelve las claves de permisos RBAC del usuario actual. Se usa en el cliente para habilitar/ocultar secciones.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de permisos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermissionsResponse'
 *             examples:
 *               ejemplo:
 *                 value:
 *                   permissions: ["MOVEMENTS_READ", "MOVEMENTS_CREATE", "USERS_READ", "REPORTS_READ"]
 *       401:
 *         description: No autenticado
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
 */
/**
 * Devuelve el listado de permisos (RBAC) del usuario autenticado.
 *
 * Se usa desde el cliente para ocultar/mostrar secciones y validar accesos.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const session = await getServerSession(req);
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  const permissions = await getUserPermissionKeys(session.user.id);
  return res.status(200).json({ permissions });
}
