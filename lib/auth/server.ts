import type { IncomingMessage } from 'http';

import { auth, type Session } from '@/lib/auth';

const toHeaders = (req: IncomingMessage) => {
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === 'string') headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(','));
  }

  return headers;
};

export const getServerSession = async (req: IncomingMessage) => {
  // Better Auth exposes a server API; use request headers so it can read cookies.
  // If the library signature changes, TypeScript will flag it during build.
  const session = (await auth.api.getSession({
    headers: toHeaders(req),
  })) as Session | null;

  return session;
};
