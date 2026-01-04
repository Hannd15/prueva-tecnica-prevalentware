import { createMocks } from 'node-mocks-http';
import handler from '@/pages/api/movements/index';
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
    movement: {
      count: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      groupBy: jest.fn(),
    },
  },
}));

describe('/api/movements', () => {
  it('returns 401 if no session', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(401);
  });

  it('returns 403 if user lacks permission', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (getUserPermissionKeys as jest.Mock).mockResolvedValue([]);
    const { req, res } = createMocks({ method: 'GET' });
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(403);
  });

  it('returns paginated movements if authorized', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: '1' } });
    (getUserPermissionKeys as jest.Mock).mockResolvedValue([PERMISSIONS.MOVEMENTS_READ]);
    
    (prisma.movement.count as jest.Mock).mockResolvedValue(1);
    (prisma.movement.findMany as jest.Mock).mockResolvedValue([
      {
        id: 'm1',
        concept: 'Test Movement',
        amount: 100,
        date: new Date(),
        type: 'INCOME',
        user: { name: 'Test User' },
      },
    ]);
    (prisma.movement.groupBy as jest.Mock).mockResolvedValue([
      { type: 'INCOME', _sum: { amount: 100 } },
      { type: 'EXPENSE', _sum: { amount: 0 } },
    ]);

    const { req, res } = createMocks({
      method: 'GET',
      query: { page: '1', pageSize: '10' },
    });

    await handler(req as any, res as any);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.data).toHaveLength(1);
    expect(data.meta.total).toBe(1);
  });
});
