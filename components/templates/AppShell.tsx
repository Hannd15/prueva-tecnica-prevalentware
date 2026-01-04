import type { ReactNode } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { AppSidebar } from '@/components/organisms/AppSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';
import { cn } from '@/lib/utils';

export type AppShellProps = {
  children: ReactNode;
  className?: string;
  /**
   * Optional override for the main content wrapper.
   *
   * AppShell applies a default vertical rhythm (space between sections) so
   * individual pages don't need to repeat spacing utilities.
   */
  contentClassName?: string;
};

/**
 * Base application layout.
 *
 * Non-responsive by design (per the technical test notes).
 */
export const AppShell = ({
  children,
  className,
  contentClassName,
}: AppShellProps) => (
  <div className={cn('min-h-screen bg-background', className)}>
    <div className='flex min-h-screen'>
      <AppSidebar />
      <main className='flex-1 p-12'>
        <AppShellHeader />
        <div className={cn('space-y-10', contentClassName)}>{children}</div>
      </main>
    </div>
  </div>
);

const AppShellHeader = () => {
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

  if (isPending) {
    return <div className='mb-10 h-10' />;
  }

  if (!session) {
    return (
      <header className='mb-10 flex items-center justify-end'>
        <Button asChild>
          <Link href='/login'>Iniciar sesión</Link>
        </Button>
      </header>
    );
  }

  const name = session.user?.name ?? session.user?.email ?? 'Usuario';
  const image = session.user?.image ?? '';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <header className='mb-10 flex items-center justify-end gap-4'>
      <div className='flex items-center gap-3'>
        <Avatar>
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{initials || 'U'}</AvatarFallback>
        </Avatar>
        <div className='text-sm font-medium'>{name}</div>
      </div>

      <Button variant='secondary' onClick={onLogout}>
        Cerrar sesión
      </Button>
    </header>
  );
};
