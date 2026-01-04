import { useQuery } from '@tanstack/react-query';
import { Edit } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
  DataTable,
  type DataTableColumn,
} from '@/components/organisms/DataTable';
import { PageHeader } from '@/components/organisms/PageHeader';
import { AppShell } from '@/components/templates/AppShell';
import { Button } from '@/components/ui/button';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { type PaginatedUsersResponse, type UserWithRole } from '@/types';

import { NextPageAuth } from '@/pages/_app';

const UsersPage = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 1;
  const pageSize = Number(router.query.pageSize) || 10;

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, pageSize],
    queryFn: async () => {
      const res = await fetch(`/api/users?page=${page}&pageSize=${pageSize}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json() as Promise<PaginatedUsersResponse>;
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
      cell: (row) => row.roleName,
    },
    {
      key: 'actions',
      header: 'Acciones',
      headerClassName: 'text-right',
      className: 'text-right',
      cell: (row) => (
        <Button variant='ghost' size='icon' className='h-8 w-8' asChild>
          <Link href={`/users/${row.id}`}>
            <Edit className='h-4 w-4' />
          </Link>
        </Button>
      ),
    },
  ];

  const onPageChange = (page: number) => {
    void router.push({
      pathname: router.pathname,
      query: { ...router.query, page },
    });
  };

  const onPageSizeChange = (pageSize: number) => {
    void router.push({
      pathname: router.pathname,
      query: { ...router.query, pageSize, page: 1 },
    });
  };

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
        rows={data?.data ?? []}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        emptyMessage='No hay usuarios registrados.'
        pagination={
          data
            ? {
                ...data.meta,
                onPageChange,
                onPageSizeChange,
              }
            : undefined
        }
        className='flex-1 min-h-0'
      />
    </AppShell>
  );
};

(UsersPage as NextPageAuth).requiredPermissions = [PERMISSIONS.USERS_READ];

export default UsersPage;
