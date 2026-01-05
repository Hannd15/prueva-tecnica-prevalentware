import { NextApiRequest, NextApiResponse } from 'next';
import { spec } from '@/lib/swagger';

/**
 * @openapi
 * /api/docs/openapi:
 *   get:
 *     tags: [Docs]
 *     summary: Documento OpenAPI (JSON)
 *     description: Devuelve el spec OpenAPI generado a partir de los bloques `@openapi` en los handlers.
 *     responses:
 *       200:
 *         description: Spec OpenAPI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
/**
 * Devuelve el documento OpenAPI (JSON) generado.
 *
 * Es consumido por Swagger UI en `/api/docs`.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(spec);
}
