import type { NextApiRequest, NextApiResponse } from 'next';
import { MovementType } from '@prisma/client';

import { getServerSession } from '@/lib/auth/server';
import { prisma } from '@/lib/db';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { getUserPermissionKeys } from '@/lib/rbac/server';
import {
  type MovementListItem,
  type PaginatedMovementsResponse,
} from '@/types';

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
}): MovementListItem => ({
  id: movement.id,
  concept: movement.concept,
  amount: movement.amount,
  date: movement.date.toISOString(),
  type: movement.type,
  userName: movement.user?.name ?? null,
});

/**
 * @openapi
 * /api/movements:
 *   get:
 *     summary: Get paginated movements
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of movements
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new movement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - concept
 *               - amount
 *               - date
 *               - type
 *             properties:
 *               concept:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *     responses:
 *       201:
 *         description: Movement created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
const handleGet = async (
  req: NextApiRequest,
  res: NextApiResponse<PaginatedMovementsResponse | ErrorResponse>
) => {
  const page = Math.max(1, parseNumber(req.query.page) ?? 1);
  const pageSize = Math.max(1, parseNumber(req.query.pageSize) ?? 10);

  try {
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

    const result: PaginatedMovementsResponse = {
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
    };

    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const parseMovementBody = (body: Record<string, unknown>) => ({
  amount: parseNumber(body?.amount),
  concept: typeof body?.concept === 'string' ? body.concept.trim() : '',
  date: parseDate(body?.date),
  type: body?.type as MovementType | undefined,
});

const validateMovement = (
  body: Record<string, unknown>
):
  | { error: string }
  | {
      data: {
        concept: string;
        amount: number;
        date: Date;
        type: MovementType;
      };
    } => {
  const { amount, concept, date, type } = parseMovementBody(body);

  if (!concept) return { error: 'Concepto es requerido' };
  if (amount === null) return { error: 'Monto es inválido' };
  if (!date) return { error: 'Fecha es inválida' };
  if (!type || !Object.values(MovementType).includes(type)) {
    return { error: 'Tipo es inválido' };
  }

  return { data: { concept, amount, date, type } };
};

const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse<MovementListItem | ErrorResponse>,
  userId: string
) => {
  const validation = validateMovement(req.body as Record<string, unknown>);

  if ('error' in validation) {
    return res.status(400).json({ error: validation.error });
  }

  const { concept, amount, date, type } = validation.data;

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
    PaginatedMovementsResponse | MovementListItem | ErrorResponse
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
