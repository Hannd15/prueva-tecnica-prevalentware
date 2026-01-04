import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { TitledCard } from '@/components/molecules/TitledCard';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';

const LoginPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && session) {
      void router.replace('/');
    }
  }, [isPending, router, session]);

  const onLogin = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/',
        errorCallbackURL: '/login',
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Iniciar sesión | Prueba Técnica</title>
      </Head>

      <div className='min-h-screen bg-background p-12'>
        <div className='mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center'>
          <TitledCard
            className='w-full'
            title='Iniciar sesión'
            description='Accede usando tu cuenta de GitHub.'
            contentClassName='space-y-4'
          >
            {error ? (
              <div className='text-sm text-destructive'>{error}</div>
            ) : null}

            <Button
              type='button'
              className='w-full'
              onClick={onLogin}
              disabled={isPending || isSubmitting}
            >
              {isSubmitting ? 'Redirigiendo…' : 'Continuar con GitHub'}
            </Button>
          </TitledCard>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
