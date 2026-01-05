import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';
import { UserMenu } from '@/components/molecules/UserMenu';

/**
 * Encabezado principal de la aplicación.
 * Contiene el menú de usuario y acciones globales.
 */
export const AppHeader = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const onLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          await router.push('/login');
        },
      },
    });
  };

  return (
    <header className='h-16 border-b bg-background flex items-center justify-end px-8 shrink-0'>
      <div className='flex items-center gap-4'>
        {isPending ? (
          <div className='w-8 h-8 rounded-full bg-muted animate-pulse' />
        ) : session ? (
          <UserMenu session={session} onLogout={onLogout} />
        ) : (
          <Button size='sm' onClick={() => router.push('/login')}>
            Iniciar sesión
          </Button>
        )}
      </div>
    </header>
  );
};
