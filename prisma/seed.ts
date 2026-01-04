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
    data: [
      { roleId: 'role_user', permissionId: 'perm_movements_read' },
      { roleId: 'role_user', permissionId: 'perm_movements_create' },
    ],
    skipDuplicates: true,
  });

  // Seed test users
  const testUsers = Array.from({ length: 25 }).map((_, i) => ({
    id: `test-user-${i + 1}`,
    name: `Test User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    emailVerified: true,
    roleId: i % 5 === 0 ? 'role_admin' : 'role_user', // Every 5th user is an admin
    createdAt: new Date(Date.now() - i * 3600000), // Spread out creation times
    updatedAt: new Date(),
  }));

  for (const user of testUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
};

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
