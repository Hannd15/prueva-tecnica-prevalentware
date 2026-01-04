import { useState } from 'react';

import { LabeledInput } from '@/components/molecules/LabeledInput';
import { LabeledSelect } from '@/components/molecules/LabeledSelect';
import { Button } from '@/components/ui/button';
import { Role, UserDetail } from '@/types';

interface UserEditFormProps {
  user: UserDetail;
  roles: Role[];
  onSave: (data: { name: string; phone: string; roleId: string }) => void;
  onCancel: () => void;
  isSaving: boolean;
  error: string | null;
}

export const UserEditForm = ({
  user,
  roles,
  onSave,
  onCancel,
  isSaving,
  error,
}: UserEditFormProps) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? '');
  const [roleId, setRoleId] = useState(user.roleId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, phone, roleId });
  };

  return (
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
        placeholder='Ej: 300 123 4567'
      />

      <LabeledSelect
        label='Rol'
        id='role'
        value={roleId}
        onValueChange={setRoleId}
        options={roles.map((r) => ({ value: r.id, label: r.name }))}
      />

      {error && <p className='text-sm text-destructive'>{error}</p>}

      <div className='flex gap-3'>
        <Button type='submit' disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
        <Button type='button' variant='secondary' onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
