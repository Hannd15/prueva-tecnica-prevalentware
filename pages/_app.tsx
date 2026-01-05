import '@/styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import Router, { useRouter } from 'next/router';
import React, { useSyncExternalStore } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { authClient } from '@/lib/auth/client';
import { getServerSession } from '@/lib/auth/server';
import { hasAllPermissions } from '@/lib/rbac/permissions';
import { getUserPermissionKeys } from '@/lib/rbac/server';
import { usePermissions } from '@/lib/rbac/client';
import { PageLoader } from '@/components/molecules/PageLoader';

// --- Store del Router para useSyncExternalStore ---
// Permite rastrear el estado de carga de las rutas de forma reactiva.
let isRouteLoading = false;
const listeners = new Set<() => void>();

const subscribe = (callback: () => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const getSnapshot = () => isRouteLoading;
const getServerSnapshot = () => false;

const emit = () => listeners.forEach((callback) => callback());

Router.events.on('routeChangeStart', (url) => {
  if (url !== Router.asPath) {
    isRouteLoading = true;
    emit();
  }
});

Router.events.on('routeChangeComplete', () => {
  isRouteLoading = false;
  emit();
});

Router.events.on('routeChangeError', () => {
  isRouteLoading = false;
  emit();
});
// --------------------------------------------------

export type NextPageAuth = {
  requiredPermissions?: string[];
};

type AppPropsWithAuth = AppProps & {
  Component: AppProps['Component'] & NextPageAuth;
};

const isPublicPath = (pathname: string) => pathname === '/login';

/**
 * Guard de autenticación/autorización.
 *
 * - Bloquea contenido privado si no hay sesión.
 * - Si la página declara `requiredPermissions`, valida RBAC antes de renderizar.
 */
const AuthGuard = ({
  children,
  requiredPermissions,
}: {
  children: React.ReactNode;
  requiredPermissions?: string[];
}) => {
  const { data: session, isPending } = authClient.useSession();
  const { permissions, isLoading: isPermissionsLoading } = usePermissions({
    enabled: !!session,
  });

  if (isPending || !session) return null;

  if (requiredPermissions?.length) {
    if (isPermissionsLoading) return null;
    if (!hasAllPermissions(permissions, requiredPermissions)) return null;
  }

  return <>{children}</>;
};

const MyApp = ({ Component, pageProps }: AppPropsWithAuth) => {
  const router = useRouter();
  const isRouteLoading = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
    []
  );

  const content = isPublicPath(router.pathname) ? (
    <Component {...pageProps} />
  ) : (
    <AuthGuard requiredPermissions={Component.requiredPermissions}>
      <Component {...pageProps} />
    </AuthGuard>
  );

  return (
    <QueryClientProvider client={queryClient}>
      {isRouteLoading && <PageLoader />}
      {content}
    </QueryClientProvider>
  );
};

const handlePublicPathRedirect = (
  ctx: AppContext['ctx'],
  isLoggedIn: boolean
) => {
  // Si el usuario ya inició sesión, no debería volver a /login.
  if (isLoggedIn) {
    ctx.res?.writeHead(302, { Location: '/' });
    ctx.res?.end();
  }
};

const handlePrivatePathRedirect = (
  ctx: AppContext['ctx'],
  isLoggedIn: boolean
) => {
  // Si no hay sesión, forzamos redirección a /login para rutas privadas.
  if (!isLoggedIn) {
    ctx.res?.writeHead(302, { Location: '/login' });
    ctx.res?.end();
  }
};

const handlePermissionRedirect = async (
  ctx: AppContext['ctx'],
  userId: string,
  required?: string[]
) => {
  // Validación RBAC en servidor para evitar que se acceda a páginas sin permiso.
  if (required?.length) {
    const permissions = await getUserPermissionKeys(userId);
    if (!hasAllPermissions(permissions, required)) {
      ctx.res?.writeHead(302, { Location: '/' });
      ctx.res?.end();
    }
  }
};

const handleServerSideRedirects = async (
  ctx: AppContext['ctx'],
  Component: NextPageAuth
) => {
  if (!ctx.req || !ctx.res) return;

  const session = await getServerSession(ctx.req);
  const isLoggedIn = !!session?.user?.id;
  const { pathname } = ctx;

  if (isPublicPath(pathname)) {
    handlePublicPathRedirect(ctx, isLoggedIn);
    return;
  }

  handlePrivatePathRedirect(ctx, isLoggedIn);

  if (isLoggedIn && session?.user?.id) {
    await handlePermissionRedirect(
      ctx,
      session.user.id,
      Component.requiredPermissions
    );
  }
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  await handleServerSideRedirects(
    appContext.ctx,
    appContext.Component as NextPageAuth
  );
  return appProps;
};

export default MyApp;
