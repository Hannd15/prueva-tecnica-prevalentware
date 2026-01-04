import { prisma } from '@/lib/db';

export const getUserPermissionKeys = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { roleId: true },
  });

  if (!user) return [] as string[];

  const rolePermissions = await prisma.rolePermission.findMany({
    where: { roleId: user.roleId },
    select: {
      permission: {
        select: { key: true },
      },
    },
  });

  return rolePermissions.map((row) => row.permission.key);
};
