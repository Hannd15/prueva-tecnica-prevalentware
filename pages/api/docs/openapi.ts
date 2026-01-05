import { NextApiRequest, NextApiResponse } from 'next';
import { spec } from '@/lib/swagger';

/**
 * Devuelve el documento OpenAPI (JSON) generado.
 *
 * Es consumido por Swagger UI en `/api/docs`.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(spec);
}
