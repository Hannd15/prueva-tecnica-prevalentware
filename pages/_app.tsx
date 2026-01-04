import '@/styles/globals.css';
import type { AppContext, AppProps } from 'next/app';
import App from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { authClient } from '@/lib/auth/client';
import { getServerSession } from '@/lib/auth/server';
import { hasAllPermissions } from '@/lib/rbac/permissions';
import { getUserPermissionKeys } from '@/lib/rbac/server';
import { usePermissions } from '@/lib/rbac/client';

export type NextPageAuth = {
  requiredPermissions?: string[];
};

type AppPropsWithAuth = AppProps & {
  Component: AppProps['Component'] & NextPageAuth;
};

const isPublicPath = (pathname: string) => pathname === '/login';

const MyApp = ({ Component, pageProps }: AppPropsWithAuth) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { permissions, isLoading: isPermissionsLoading } = usePermissions({
    enabled: !!session,
  });

  useEffect(() => {
    if (isPublicPath(router.pathname)) return;
    if (isPending) return;
    if (!session) {
      void router.replace('/login');
    }
  }, [isPending, router, session]);

  useEffect(() => {
    const required = Component.requiredPermissions;
    if (!required?.length) return;
    if (!session) return;
    if (isPermissionsLoading) return;

    if (!hasAllPermissions(permissions, required)) {
      void router.replace('/');
    }
  }, [
    Component.requiredPermissions,
    isPermissionsLoading,
    permissions,
    router,
    session,
  ]);

  if (!isPublicPath(router.pathname) && (isPending || !session)) {
    return null;
  }

  if (
    Component.requiredPermissions?.length &&
    session &&
    isPermissionsLoading
  ) {
    return null;
  }

  if (
    Component.requiredPermissions?.length &&
    session &&
    !hasAllPermissions(permissions, Component.requiredPermissions)
  ) {
    return null;
  }

  return <Component {...pageProps} />;
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const { ctx, Component } = appContext;
  const pathname = ctx.pathname;

  if (isPublicPath(pathname)) {
    return appProps;
  }

  // Server-side protection (initial request / hard refresh).
  if (ctx.req && ctx.res) {
    const session = await getServerSession(ctx.req);

    if (!session?.user?.id) {
      ctx.res.writeHead(302, { Location: '/login' });
      ctx.res.end();
      return appProps;
    }

    const required = (Component as NextPageAuth).requiredPermissions;
    if (required?.length) {
      const permissions = await getUserPermissionKeys(session.user.id);
      if (!hasAllPermissions(permissions, required)) {
        ctx.res.writeHead(302, { Location: '/' });
        ctx.res.end();
        return appProps;
      }
    }
  }

  return appProps;
};

export default MyApp;
