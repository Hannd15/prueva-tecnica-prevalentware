import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { PageHeader } from '@/components/organisms/PageHeader';
import { AppShell } from '@/components/templates/AppShell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
  const [date, setDate] = useState<string>('');
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
        body: JSON.stringify({ amount, concept, date }),
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
    <>
      <Head>
        <title>Nuevo movimiento | Prueba Técnica</title>
      </Head>

      <AppShell contentClassName='space-y-6'>
        <PageHeader
          title='Nuevo movimiento'
          subtitle='Registra un ingreso o egreso.'
        />

        <Card>
          <CardHeader>
            <CardTitle>Formulario</CardTitle>
            <CardDescription>
              Completa los datos del movimiento.
            </CardDescription>
          </CardHeader>

          <form onSubmit={onSubmit} className='space-y-4 px-6 pb-6'>
            <div className='space-y-2'>
              <label className='text-sm font-medium' htmlFor='amount'>
                Monto
              </label>
              <Input
                id='amount'
                name='amount'
                inputMode='decimal'
                placeholder='100000'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium' htmlFor='concept'>
                Concepto
              </label>
              <Input
                id='concept'
                name='concept'
                placeholder='Pago de servicios'
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium' htmlFor='date'>
                Fecha
              </label>
              <Input
                id='date'
                name='date'
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

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
        </Card>
      </AppShell>
    </>
  );
};

export default NewMovementPage;
