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

const AuthGuard = ({
  children,
  requiredPermissions,
}: {
  children: React.ReactNode;
  requiredPermissions?: string[];
}) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { permissions, isLoading: isPermissionsLoading } = usePermissions({
    enabled: !!session,
  });

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      void router.replace('/login');
    }
  }, [isPending, router, session]);

  useEffect(() => {
    if (!requiredPermissions?.length || !session || isPermissionsLoading)
      return;

    if (!hasAllPermissions(permissions, requiredPermissions)) {
      void router.replace('/');
    }
  }, [requiredPermissions, isPermissionsLoading, permissions, router, session]);

  if (isPending || !session) return null;

  if (requiredPermissions?.length) {
    if (isPermissionsLoading) return null;
    if (!hasAllPermissions(permissions, requiredPermissions)) return null;
  }

  return <>{children}</>;
};

const MyApp = ({ Component, pageProps }: AppPropsWithAuth) => {
  const router = useRouter();

  if (isPublicPath(router.pathname)) {
    return <Component {...pageProps} />;
  }

  return (
    <AuthGuard requiredPermissions={Component.requiredPermissions}>
      <Component {...pageProps} />
    </AuthGuard>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const { ctx, Component } = appContext;
  const { pathname } = ctx;

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
