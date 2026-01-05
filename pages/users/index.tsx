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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { type PaginatedUsersResponse, type UserWithRole } from '@/types';

import { NextPageAuth } from '@/pages/_app';

/**
 * Página de gestión de usuarios.
 *
 * Lista usuarios de forma paginada. Requiere permiso `USERS_READ`.
 * Utiliza una estética de "Directorio" profesional.
 */
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
      header: 'Usuario',
      cell: (row) => (
        <div className='flex items-center gap-3'>
          <Avatar className='h-8 w-8 border'>
            <AvatarFallback className='bg-secondary text-secondary-foreground text-xs'>
              {(row.name ?? 'U').substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className='font-medium text-foreground'>{row.name}</span>
            <span className='text-xs text-muted-foreground md:hidden'>
              {row.roleName}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contacto',
      className: 'hidden sm:table-cell',
      cell: (row) => (
        <div className='flex flex-col'>
          <span className='text-sm'>{row.email}</span>
          {row.phone && (
            <span className='text-xs text-muted-foreground'>{row.phone}</span>
          )}
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      className: 'hidden md:table-cell',
      cell: (row) => (
        <Badge variant='secondary' className='font-normal'>
          {row.roleName}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      headerClassName: 'w-[50px]',
      className: 'text-right',
      cell: (row) => (
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 hover:bg-secondary'
          asChild
          title='Editar usuario'
        >
          <Link href={`/users/${row.id}`}>
            <Edit className='h-4 w-4 text-muted-foreground' />
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
    <AppShell pageTitle='Usuarios' contentClassName='space-y-8'>
      <PageHeader
        title='Usuarios'
        subtitle='Administra los accesos y perfiles de los colaboradores.'
      />

      <DataTable
        title='Directorio de Usuarios'
        description='Gestiona los permisos y la información de contacto de los usuarios.'
        columns={columns}
        rows={data?.data ?? []}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        emptyMessage='No se encontraron usuarios.'
        pagination={
          data
            ? {
                ...data.meta,
                onPageChange,
                onPageSizeChange,
              }
            : undefined
        }
      />
    </AppShell>
  );
};

(UsersPage as NextPageAuth).requiredPermissions = [PERMISSIONS.USERS_READ];

export default UsersPage;
