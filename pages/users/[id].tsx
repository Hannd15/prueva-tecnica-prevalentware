import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { TitledCard } from '@/components/molecules/TitledCard';
import { PageHeader } from '@/components/organisms/PageHeader';
import { UserEditForm } from '@/components/organisms/UserEditForm';
import { AppShell } from '@/components/templates/AppShell';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { NextPageAuth } from '@/pages/_app';
import { Role, UserDetail } from '@/types';

/**
 * Página de edición de usuario.
 *
 * Carga el usuario y los roles, y permite actualizar nombre/teléfono/rol.
 * Requiere permiso `USERS_EDIT`.
 */
const EditUserPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json() as Promise<UserDetail>;
    },
    enabled: !!id,
  });

  const { data: roles, isLoading: isRolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await fetch('/api/roles');
      if (!res.ok) throw new Error('Failed to fetch roles');
      return res.json() as Promise<Role[]>;
    },
  });

  const mutation = useMutation({
    mutationFn: async (updatedData: {
      name: string;
      phone: string;
      roleId: string;
    }) => {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error('Failed to update user');
      return res.json();
    },
    onSuccess: async () => {
      // Si el usuario editado es el mismo que tiene la sesión iniciada,
      // se fuerza una recarga completa para refrescar los permisos en el cliente y servidor.
      const sessionRes = await fetch('/api/auth/get-session');
      const session = await sessionRes.json().catch(() => null);

      if (session?.user?.id === id) {
        window.location.href = '/';
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/users');
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  if (isUserLoading || isRolesLoading) {
    return (
      <AppShell pageTitle='Editar usuario'>
        <div className='flex items-center justify-center h-64'>Cargando...</div>
      </AppShell>
    );
  }

  if (!user || !roles) return null;

  return (
    <AppShell pageTitle='Editar usuario' contentClassName='space-y-6'>
      <PageHeader
        title='Editar usuario'
        subtitle={`Modifica los datos de ${user.email}`}
      />

      <TitledCard
        title='Datos del usuario'
        description='Actualiza el nombre, teléfono y rol del usuario.'
      >
        <UserEditForm
          user={user}
          roles={roles}
          onSave={(data) => mutation.mutate(data)}
          onCancel={() => router.push('/users')}
          isSaving={mutation.isPending}
          error={error}
        />
      </TitledCard>
    </AppShell>
  );
};

(EditUserPage as NextPageAuth).requiredPermissions = [PERMISSIONS.USERS_EDIT];

export default EditUserPage;
