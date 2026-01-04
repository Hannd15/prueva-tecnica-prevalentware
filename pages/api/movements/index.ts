import type { NextApiRequest, NextApiResponse } from 'next';
import { MovementType } from '@prisma/client';

import { getServerSession } from '@/lib/auth/server';
import { prisma } from '@/lib/db';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { getUserPermissionKeys } from '@/lib/rbac/server';

type MovementListItem = {
  id: string;
  concept: string;
  amount: number;
  date: string;
  type: MovementType;
  userName: string | null;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  summary: {
    totalIncomes: number;
    totalExpenses: number;
    balance: number;
  };
};

type ErrorResponse = {
  error: string;
};

const userSelect = {
  select: {
    name: true,
  },
} as const;

const parseNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const parseDate = (value: unknown): Date | null => {
  if (typeof value !== 'string' || value.trim() === '') return null;

  // Accept both "YYYY-MM-DD" and full ISO strings.
  const date =
    value.length === 10 ? new Date(`${value}T00:00:00.000Z`) : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date;
};

const toMovementListItem = (movement: {
  id: string;
  concept: string;
  amount: number;
  date: Date;
  type: MovementType;
  user: { name: string | null } | null;
}): MovementListItem => {
  return {
    id: movement.id,
    concept: movement.concept,
    amount: movement.amount,
    date: movement.date.toISOString(),
    type: movement.type,
    userName: movement.user?.name ?? null,
  };
};

const handleGet = async (
  req: NextApiRequest,
  res: NextApiResponse<PaginatedResponse<MovementListItem> | ErrorResponse>
) => {
  const page = Math.max(1, parseNumber(req.query.page) ?? 1);
  const pageSize = Math.max(1, parseNumber(req.query.pageSize) ?? 10);

  const [total, movements, summary] = await Promise.all([
    prisma.movement.count(),
    prisma.movement.findMany({
      orderBy: { date: 'desc' },
      include: { user: userSelect },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.movement.groupBy({
      by: ['type'],
      _sum: {
        amount: true,
      },
    }),
  ]);

  const totalIncomes =
    summary.find((s) => s.type === MovementType.INCOME)?._sum.amount ?? 0;
  const totalExpenses =
    summary.find((s) => s.type === MovementType.EXPENSE)?._sum.amount ?? 0;

  return res.status(200).json({
    data: movements.map(toMovementListItem),
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
    summary: {
      totalIncomes,
      totalExpenses,
      balance: totalIncomes - totalExpenses,
    },
  });
};

const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse<MovementListItem | ErrorResponse>,
  userId: string
) => {
  const amount = parseNumber(req.body?.amount);
  const concept =
    typeof req.body?.concept === 'string' ? req.body.concept.trim() : '';
  const date = parseDate(req.body?.date);
  const type = req.body?.type as MovementType | undefined;

  if (!concept) return res.status(400).json({ error: 'Concepto es requerido' });
  if (amount === null)
    return res.status(400).json({ error: 'Monto es inválido' });
  if (!date) return res.status(400).json({ error: 'Fecha es inválida' });
  if (!type || !Object.values(MovementType).includes(type)) {
    return res.status(400).json({ error: 'Tipo es inválido' });
  }

  const movement = await prisma.movement.create({
    data: {
      concept,
      amount,
      date,
      type,
      userId,
    },
    include: { user: userSelect },
  });

  return res.status(201).json(toMovementListItem(movement));
};

/**
 * Movements API.
 *
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    PaginatedResponse<MovementListItem> | MovementListItem | ErrorResponse
  >
) {
  const session = await getServerSession(req);
  const userId = session?.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }

  const permissions = await getUserPermissionKeys(userId);

  switch (req.method) {
    case 'GET':
      if (!permissions.includes(PERMISSIONS.MOVEMENTS_READ)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return handleGet(req, res);
    case 'POST':
      if (!permissions.includes(PERMISSIONS.MOVEMENTS_CREATE)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return handlePost(req, res, userId);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}
