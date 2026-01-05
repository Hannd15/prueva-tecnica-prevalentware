import { toNodeHandler } from 'better-auth/node';
import { auth } from '@/lib/auth';

// Deshabilitamos el body parser de Next: better-auth parsea el body manualmente.
export const config = { api: { bodyParser: false } };

export default toNodeHandler(auth.handler);
