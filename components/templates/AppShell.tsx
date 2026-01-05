import type { ReactNode } from 'react';

import Head from 'next/head';

import { AppSidebar } from '@/components/organisms/AppSidebar';
import { AppHeader } from '@/components/organisms/AppHeader';
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
      <title>{pageTitle ? `${pageTitle} | Finanzas` : 'Finanzas'}</title>
    </Head>

    <div
      className={cn('h-screen bg-background flex overflow-hidden', className)}
    >
      <AppSidebar />

      <div className='flex flex-1 flex-col min-w-0 overflow-hidden'>
        <AppHeader />

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
