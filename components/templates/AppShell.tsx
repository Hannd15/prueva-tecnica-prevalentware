import type { ReactNode } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { LogOut } from 'lucide-react';

import { AppSidebar } from '@/components/organisms/AppSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth/client';
import { cn } from '@/lib/utils';

export type AppShellProps = {
  children: ReactNode;
  className?: string;
  pageTitle?: string;
  contentClassName?: string;
};

/**
 * Layout base de la aplicación.
 * Diseño profesional con enfoque en jerarquía visual y espacios limpios.
 */
export const AppShell = ({
  children,
  className,
  pageTitle,
  contentClassName,
}: AppShellProps) => (
  <>
    <Head>
      <title>{pageTitle ? `${pageTitle} | FinanceApp` : 'FinanceApp'}</title>
    </Head>

    <div
      className={cn('h-screen bg-background flex overflow-hidden', className)}
    >
      <AppSidebar />

      <div className='flex flex-1 flex-col min-w-0 overflow-hidden'>
        <AppShellHeader />

        <main className='flex-1 overflow-y-auto bg-slate-50/50'>
          <div
            className={cn(
              'max-w-7xl mx-auto p-8 lg:p-12 space-y-8',
              contentClassName
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  </>
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

  return (
    <header className='h-16 border-b bg-background flex items-center justify-between px-8 shrink-0'>
      <div className='flex items-center gap-4'>
        <div className='h-8 w-px bg-border mx-1' />

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

const UserMenu = ({
  session,
  onLogout,
}: {
  session: { user: { name: string; email: string; image?: string | null } };
  onLogout: () => void;
}) => {
  const name = session.user?.name ?? session.user?.email ?? 'Usuario';
  const image = session.user?.image ?? '';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join('');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='relative h-9 w-9 rounded-full p-0 hover:bg-transparent'
        >
          <Avatar className='h-9 w-9 border border-border/50 shadow-sm transition-transform hover:scale-105'>
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className='bg-primary/5 text-primary text-xs font-bold'>
              {initials || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-semibold leading-none'>{name}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {session.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-destructive focus:text-destructive cursor-pointer'
          onClick={onLogout}
        >
          <LogOut className='mr-2 h-4 w-4' />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
