import { useState } from 'react';
import { Save, X } from 'lucide-react';

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

/**
 * Formulario de edición de usuario.
 *
 * Inicializa su estado con el usuario recibido y emite el payload mínimo
 * para actualizar (nombre/teléfono/rol).
 * Utiliza una estética limpia y profesional.
 */
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
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='grid gap-6 sm:grid-cols-2'>
        <LabeledInput
          label='Nombre Completo'
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSaving}
          placeholder='Ej: Juan Pérez'
        />

        <LabeledInput
          label='Teléfono de Contacto'
          id='phone'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder='Ej: +57 300 123 4567'
          disabled={isSaving}
        />
      </div>

      <LabeledSelect
        label='Rol de Usuario'
        id='role'
        value={roleId}
        onValueChange={setRoleId}
        options={roles.map((r) => ({ value: r.id, label: r.name }))}
        disabled={isSaving}
      />

      {error && (
        <div className='p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20'>
          {error}
        </div>
      )}

      <div className='flex items-center justify-end gap-3 pt-6 border-t'>
        <Button
          type='button'
          variant='ghost'
          onClick={onCancel}
          disabled={isSaving}
        >
          <X className='mr-2 h-4 w-4' />
          Cancelar
        </Button>
        <Button type='submit' disabled={isSaving} className='min-w-[140px]'>
          {isSaving ? (
            'Guardando...'
          ) : (
            <>
              <Save className='mr-2 h-4 w-4' />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
