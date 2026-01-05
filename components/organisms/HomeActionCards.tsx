import Link from 'next/link';
import { ArrowRight, ArrowLeftRight, Users, BarChart3 } from 'lucide-react';

import { TitledCard } from '@/components/molecules/TitledCard';
import { usePermissions } from '@/lib/rbac/client';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { HomeAction } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const actions: HomeAction[] = [
  {
    title: 'Gestión de ingresos y gastos',
    description: 'Registra ingresos/egresos y consulta movimientos.',
    href: '/movements',
    permission: PERMISSIONS.MOVEMENTS_READ,
  },
  {
    title: 'Gestión de usuarios',
    description: 'Administra usuarios y permisos.',
    href: '/users',
    permission: PERMISSIONS.USERS_READ,
  },
  {
    title: 'Reportes',
    description: 'Visualiza el saldo y exporta el reporte.',
    href: '/reports',
    permission: PERMISSIONS.REPORTS_READ,
  },
];

const getIcon = (href: string) => {
  switch (href) {
    case '/movements':
      return ArrowLeftRight;
    case '/users':
      return Users;
    case '/reports':
      return BarChart3;
    default:
      return ArrowRight;
  }
};

/**
 * Tarjetas de acceso rápido del Home.
 * Diseño moderno con iconos y estados hover refinados.
 */
export const HomeActionCards = () => {
  const { permissions, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <section
        aria-label='Quick actions'
        className='grid grid-cols-1 md:grid-cols-3 gap-8'
      >
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className='h-48 w-full rounded-xl' />
        ))}
      </section>
    );
  }

  const visibleActions = actions.filter((action) =>
    permissions.includes(action.permission)
  );

  return (
    <section
      aria-label='Quick actions'
      className='grid grid-cols-1 md:grid-cols-3 gap-8'
    >
      {visibleActions.map((action) => {
        const Icon = getIcon(action.href);
        return (
          <Link key={action.href} href={action.href} className='group block'>
            <TitledCard
              className='h-full border-border/40 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1'
              title={
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-primary/5 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors'>
                    <Icon className='h-5 w-5' />
                  </div>
                  <span className='group-hover:text-primary transition-colors'>
                    {action.title}
                  </span>
                </div>
              }
              description={action.description}
              titleClassName='text-lg font-bold leading-tight'
              descriptionClassName='mt-2'
              actions={
                <ArrowRight className='h-5 w-5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all' />
              }
            />
          </Link>
        );
      })}
    </section>
  );
};
