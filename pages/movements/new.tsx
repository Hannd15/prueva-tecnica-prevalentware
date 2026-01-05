import { useRouter } from 'next/router';
import { useState } from 'react';
import { MovementType } from '@prisma/client';
import { ArrowLeft, Save } from 'lucide-react';

import { LabeledInput } from '@/components/molecules/LabeledInput';
import { LabeledSelect } from '@/components/molecules/LabeledSelect';
import { LabeledDatePicker } from '@/components/molecules/LabeledDatePicker';
import { TitledCard } from '@/components/molecules/TitledCard';
import { PageHeader } from '@/components/organisms/PageHeader';
import { AppShell } from '@/components/templates/AppShell';
import { Button } from '@/components/ui/button';
import { PERMISSIONS } from '@/lib/rbac/permissions';

import { NextPageAuth } from '@/pages/_app';

type ApiError = { error: string };

/**
 * Página para crear un nuevo movimiento.
 *
 * Requiere permiso `MOVEMENTS_CREATE`.
 * Presenta un formulario limpio y enfocado.
 */
const NewMovementPage = () => {
  const router = useRouter();

  const [amount, setAmount] = useState<string>('');
  const [concept, setConcept] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
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
        body: JSON.stringify({
          amount,
          concept,
          date: date ? date.toISOString().split('T')[0] : null,
          type,
        }),
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
    <AppShell
      pageTitle='Nuevo Movimiento'
      contentClassName='max-w-2xl mx-auto space-y-8'
    >
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => router.push('/movements')}
          className='rounded-full'
        >
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <PageHeader
          title='Registrar Movimiento'
          subtitle='Ingresa los detalles de la transacción.'
        />
      </div>

      <TitledCard
        title='Detalles de la Transacción'
        description='Asegúrate de que los montos y conceptos sean correctos.'
        className='shadow-lg border-primary/10'
      >
        <form onSubmit={onSubmit} className='space-y-6 pt-4'>
          <div className='grid gap-6 sm:grid-cols-2'>
            <LabeledSelect
              label='Tipo de Movimiento'
              id='type'
              value={type}
              onValueChange={(val) => setType(val as MovementType)}
              options={[
                { value: MovementType.INCOME, label: 'Ingreso (+)' },
                { value: MovementType.EXPENSE, label: 'Egreso (-)' },
              ]}
              disabled={isSubmitting}
            />

            <LabeledDatePicker
              label='Fecha Contable'
              id='date'
              date={date}
              setDate={setDate}
              disabled={isSubmitting}
            />
          </div>

          <LabeledInput
            label='Monto'
            id='amount'
            name='amount'
            inputMode='decimal'
            placeholder='0.00'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting}
            required
            className='text-lg font-semibold tabular-nums'
          />

          <LabeledInput
            label='Concepto o Descripción'
            id='concept'
            name='concept'
            placeholder='Ej: Pago de nómina, Venta de servicios...'
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            disabled={isSubmitting}
            required
          />

          {error ? (
            <div className='p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20'>
              {error}
            </div>
          ) : null}

          <div className='flex items-center justify-end gap-3 pt-4 border-t'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => router.push('/movements')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting}
              className='min-w-[120px]'
            >
              {isSubmitting ? (
                'Guardando...'
              ) : (
                <>
                  <Save className='mr-2 h-4 w-4' />
                  Guardar
                </>
              )}
            </Button>
          </div>
        </form>
      </TitledCard>
    </AppShell>
  );
};

(NewMovementPage as NextPageAuth).requiredPermissions = [
  PERMISSIONS.MOVEMENTS_CREATE,
];

export default NewMovementPage;
