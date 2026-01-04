import { useRouter } from 'next/router';
import { useState } from 'react';
import { MovementType } from '@prisma/client';

import { LabeledInput } from '@/components/molecules/LabeledInput';
import { LabeledSelect } from '@/components/molecules/LabeledSelect';
import { TitledCard } from '@/components/molecules/TitledCard';
import { PageHeader } from '@/components/organisms/PageHeader';
import { AppShell } from '@/components/templates/AppShell';
import { Button } from '@/components/ui/button';
import { PERMISSIONS } from '@/lib/rbac/permissions';

type ApiError = { error: string };

/**
 * New movement page.
 *
 * NOTE: Authentication/RBAC intentionally skipped for now (per request).
 */
const NewMovementPage = () => {
  const router = useRouter();

  const [amount, setAmount] = useState<string>('');
  const [concept, setConcept] = useState<string>('');
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [type, setType] = useState<MovementType>(MovementType.INCOME);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/movements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ amount, concept, date, type }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as ApiError | null;
        throw new Error(body?.error ?? `No se pudo guardar (${res.status})`);
      }

      await router.push('/movements');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell pageTitle='Nuevo movimiento' contentClassName='space-y-6'>
      <PageHeader
        title='Nuevo movimiento'
        subtitle='Registra un ingreso o egreso.'
      />

      <TitledCard
        title='Formulario'
        description='Completa los datos del movimiento.'
      >
        <form onSubmit={onSubmit} className='space-y-4'>
          <LabeledSelect
            label='Tipo'
            id='type'
            value={type}
            onValueChange={(val) => setType(val as MovementType)}
            options={[
              { value: MovementType.INCOME, label: 'Ingreso' },
              { value: MovementType.EXPENSE, label: 'Egreso' },
            ]}
            disabled={isSubmitting}
          />

          <LabeledInput
            label='Monto'
            id='amount'
            name='amount'
            inputMode='decimal'
            placeholder='100000'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting}
            required
          />

          <LabeledInput
            label='Concepto'
            id='concept'
            name='concept'
            placeholder='Pago de servicios'
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            disabled={isSubmitting}
            required
          />

          <LabeledInput
            label='Fecha'
            id='date'
            name='date'
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isSubmitting}
            required
          />

          {error ? (
            <div className='text-sm text-destructive'>{error}</div>
          ) : null}

          <div className='flex gap-3'>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button
              type='button'
              variant='secondary'
              onClick={() => router.push('/movements')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </TitledCard>
    </AppShell>
  );
};

(
  NewMovementPage as typeof NewMovementPage & { requiredPermissions?: string[] }
).requiredPermissions = [PERMISSIONS.MOVEMENTS_CREATE];

export default NewMovementPage;
