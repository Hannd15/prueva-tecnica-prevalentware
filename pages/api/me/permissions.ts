import type { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from '@/lib/auth/server';
import { getUserPermissionKeys } from '@/lib/rbac/server';

type ResponseBody =
  | { permissions: string[] }
  | {
      error: string;
    };

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
