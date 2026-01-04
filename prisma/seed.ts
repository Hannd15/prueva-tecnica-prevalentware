import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.role.upsert({
    where: { id: 'role_admin' },
    update: { name: 'ADMIN', description: 'Full access' },
    create: { id: 'role_admin', name: 'ADMIN', description: 'Full access' },
  });

  await prisma.role.upsert({
    where: { id: 'role_user' },
    update: { name: 'USER', description: 'Limited access' },
    create: { id: 'role_user', name: 'USER', description: 'Limited access' },
  });

  await prisma.permission.upsert({
    where: { id: 'perm_movements_read' },
    update: { key: 'MOVEMENTS_READ', description: 'Can view movements' },
    create: {
      id: 'perm_movements_read',
      key: 'MOVEMENTS_READ',
      description: 'Can view movements',
    },
  });

  await prisma.permission.upsert({
    where: { id: 'perm_movements_create' },
    update: { key: 'MOVEMENTS_CREATE', description: 'Can create movements' },
    create: {
      id: 'perm_movements_create',
      key: 'MOVEMENTS_CREATE',
      description: 'Can create movements',
    },
  });

  const allPermissions = await prisma.permission.findMany({
    select: { id: true },
  });

  await prisma.rolePermission.createMany({
    data: allPermissions.map((permission) => ({
      roleId: 'role_admin',
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  await prisma.rolePermission.createMany({
    data: [
      { roleId: 'role_user', permissionId: 'perm_movements_read' },
      { roleId: 'role_user', permissionId: 'perm_movements_create' },
    ],
    skipDuplicates: true,
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
