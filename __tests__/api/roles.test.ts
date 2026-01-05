import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/roles/index';
import { getServerSession } from '@/lib/auth/server';
import { getUserPermissionKeys } from '@/lib/rbac/server';
import { prisma } from '@/lib/db';
import { PERMISSIONS } from '@/lib/rbac/permissions';

jest.mock('@/lib/auth/server');
jest.mock('@/lib/rbac/server');
jest.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));
jest.mock('@/lib/db', () => ({
  prisma: {
    role: {
      findMany: jest.fn(),
    },
  },
}));

describe('/api/roles', () => {
  it('returns 401 if no session', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(401);
  });

  it('returns 403 if user lacks permission', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (getUserPermissionKeys as jest.Mock).mockResolvedValue([]);

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(403);
  });

  it('returns roles if authorized', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (getUserPermissionKeys as jest.Mock).mockResolvedValue([
      PERMISSIONS.USERS_EDIT,
    ]);
    const mockRoles = [{ id: 'r1', name: 'Admin' }];
    (prisma.role.findMany as jest.Mock).mockResolvedValue(mockRoles);

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockRoles);
  });
});
