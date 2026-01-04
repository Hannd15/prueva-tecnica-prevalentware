import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { LabeledInput } from '@/components/molecules/LabeledInput';
import { LabeledSelect } from '@/components/molecules/LabeledSelect';
import { TitledCard } from '@/components/molecules/TitledCard';
import { PageHeader } from '@/components/organisms/PageHeader';
import { AppShell } from '@/components/templates/AppShell';
import { Button } from '@/components/ui/button';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { NextPageAuth } from '@/pages/_app';

type Role = {
  id: string;
  name: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  roleId: string;
};

const EditUserPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roleId, setRoleId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json() as Promise<User>;
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

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone ?? '');
      setRoleId(user.roleId);
    }
  }, [user]);

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/users');
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, phone, roleId });
  };

  if (isUserLoading || isRolesLoading) {
    return (
      <AppShell pageTitle='Editar usuario'>
        <div className='flex items-center justify-center h-64'>Cargando...</div>
      </AppShell>
    );
  }

  return (
    <AppShell pageTitle='Editar usuario' contentClassName='space-y-6'>
      <PageHeader
        title='Editar usuario'
        subtitle={`Modifica los datos de ${user?.email}`}
      />

      <TitledCard
        title='Datos del usuario'
        description='Actualiza el nombre, teléfono y rol del usuario.'
      >
        <form onSubmit={handleSubmit} className='space-y-4'>
          <LabeledInput
            label='Nombre'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <LabeledInput
            label='Teléfono'
            id='phone'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder='Ej: +57 300 123 4567'
          />

          <LabeledSelect
            label='Rol'
            id='role'
            value={roleId}
            onValueChange={setRoleId}
            options={roles?.map((r) => ({ value: r.id, label: r.name })) ?? []}
          />

          {error && <p className='text-sm text-destructive'>{error}</p>}

          <div className='flex gap-3'>
            <Button type='submit' disabled={mutation.isPending}>
              {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
            </Button>
            <Button
              type='button'
              variant='secondary'
              onClick={() => router.push('/users')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </TitledCard>
    </AppShell>
  );
};

(EditUserPage as NextPageAuth).requiredPermissions = [PERMISSIONS.USERS_EDIT];

export default EditUserPage;
