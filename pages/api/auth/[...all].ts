import { toNodeHandler } from 'better-auth/node';
import { auth } from '@/lib/auth';

/**
 * @openapi
 * /api/auth/{path}:
 *   get:
 *     tags: [Auth]
 *     summary: Endpoints de autenticación (Better Auth)
 *     description: |
 *       Ruta comodín manejada por Better Auth para flujos de autenticación (por ejemplo OAuth).\
 *       Esta aplicación delega la implementación a la librería; la forma exacta de `path` depende del proveedor/configuración.
 *     parameters:
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Segmento de ruta dinámico bajo `/api/auth/*`.
 *     responses:
 *       200:
 *         description: Respuesta del flujo de autenticación
 *       302:
 *         description: Redirección (típico en OAuth)
 *       400:
 *         description: Solicitud inválida
 *       401:
 *         description: No autenticado
 *   post:
 *     tags: [Auth]
 *     summary: Endpoints de autenticación (Better Auth)
 *     description: Maneja callbacks y operaciones de autenticación que requieren POST.
 *     parameters:
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Respuesta del flujo de autenticación
 *       400:
 *         description: Solicitud inválida
 *       401:
 *         description: No autenticado
 */
// Deshabilitamos el body parser de Next: better-auth parsea el body manualmente.
export const config = { api: { bodyParser: false } };

export default toNodeHandler(auth.handler);
