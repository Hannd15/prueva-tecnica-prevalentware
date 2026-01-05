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

  await prisma.permission.upsert({
    where: { id: 'perm_reports_read' },
    update: { key: 'REPORTS_READ', description: 'Can view reports' },
    create: {
      id: 'perm_reports_read',
      key: 'REPORTS_READ',
      description: 'Can view reports',
    },
  });

  await prisma.permission.upsert({
    where: { id: 'perm_users_read' },
    update: { key: 'USERS_READ', description: 'Can view users' },
    create: {
      id: 'perm_users_read',
      key: 'USERS_READ',
      description: 'Can view users',
    },
  });

  await prisma.permission.upsert({
    where: { id: 'perm_users_edit' },
    update: { key: 'USERS_EDIT', description: 'Can edit users' },
    create: {
      id: 'perm_users_edit',
      key: 'USERS_EDIT',
      description: 'Can edit users',
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
    data: [{ roleId: 'role_user', permissionId: 'perm_movements_read' }],
    skipDuplicates: true,
  });
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
