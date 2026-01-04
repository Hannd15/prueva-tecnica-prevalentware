import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/db';

type MovementListItem = {
  id: string;
  concept: string;
  amount: number;
  date: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
};

type ErrorResponse = {
  error: string;
};

const userSelect = {
  select: {
    id: true,
    name: true,
    email: true,
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
  user: { id: string; name: string; email: string } | null;
}): MovementListItem => {
  const { user } = movement;
  if (!user) {
    return {
      id: movement.id,
      concept: movement.concept,
      amount: movement.amount,
      date: movement.date.toISOString(),
      user: null,
    };
  }

  return {
    id: movement.id,
    concept: movement.concept,
    amount: movement.amount,
    date: movement.date.toISOString(),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

const handleGet = async (
  res: NextApiResponse<MovementListItem[] | ErrorResponse>
) => {
  const movements = await prisma.movement.findMany({
    orderBy: { date: 'desc' },
    include: { user: userSelect },
  });

  return res.status(200).json(movements.map(toMovementListItem));
};

const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse<MovementListItem | ErrorResponse>
) => {
  const amount = parseNumber(req.body?.amount);
  const concept =
    typeof req.body?.concept === 'string' ? req.body.concept.trim() : '';
  const date = parseDate(req.body?.date);

  if (!concept) return res.status(400).json({ error: 'Concepto es requerido' });
  if (amount === null)
    return res.status(400).json({ error: 'Monto es inválido' });
  if (!date) return res.status(400).json({ error: 'Fecha es inválida' });

  const movement = await prisma.movement.create({
    data: {
      concept,
      amount,
      date,
      // No user assignment while auth is disabled.
    },
    include: { user: userSelect },
  });

  return res.status(201).json(toMovementListItem(movement));
};

/**
 * Movements API.
 *
 * NOTE: Authentication and RBAC are intentionally skipped for now (per request).
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MovementListItem[] | MovementListItem | ErrorResponse>
) {
  switch (req.method) {
    case 'GET':
      return handleGet(res);
    case 'POST':
      return handlePost(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}
