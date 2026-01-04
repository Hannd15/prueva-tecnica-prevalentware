import { useQuery } from '@tanstack/react-query';
import { Edit } from 'lucide-react';
import Link from 'next/link';

import {
  DataTable,
  type DataTableColumn,
} from '@/components/organisms/DataTable';
import { PageHeader } from '@/components/organisms/PageHeader';
import { AppShell } from '@/components/templates/AppShell';
import { Button } from '@/components/ui/button';
import { PERMISSIONS } from '@/lib/rbac/permissions';

import { NextPageAuth } from '@/pages/_app';

type UserWithRole = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: {
    name: string;
  };
};

const UsersPage = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json() as Promise<UserWithRole[]>;
    },
  });

  const columns: Array<DataTableColumn<UserWithRole>> = [
    {
      key: 'name',
      header: 'Nombre',
      cell: (row) => <span className='font-medium'>{row.name}</span>,
    },
    {
      key: 'email',
      header: 'Correo',
      cell: (row) => row.email,
    },
    {
      key: 'phone',
      header: 'Teléfono',
      cell: (row) => row.phone ?? '-',
    },
    {
      key: 'role',
      header: 'Rol',
      cell: (row) => row.role.name,
    },
    {
      key: 'actions',
      header: 'Acciones',
      headerClassName: 'text-right',
      className: 'text-right',
      cell: (row) => (
        <Button variant='ghost' size='icon' asChild>
          <Link href={`/users/${row.id}`}>
            <Edit className='h-4 w-4' />
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <AppShell pageTitle='Gestión de usuarios' contentClassName='space-y-6'>
      <PageHeader
        title='Gestión de usuarios'
        subtitle='Administra los usuarios del sistema y sus roles.'
      />

      <DataTable
        title='Usuarios'
        description='Listado de usuarios registrados en la plataforma.'
        columns={columns}
        rows={users ?? []}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        emptyMessage='No hay usuarios registrados.'
      />
    </AppShell>
  );
};

(UsersPage as NextPageAuth).requiredPermissions = [PERMISSIONS.USERS_READ];

export default UsersPage;
