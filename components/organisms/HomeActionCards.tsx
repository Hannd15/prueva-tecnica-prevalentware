import Link from 'next/link';

import { TitledCard } from '@/components/molecules/TitledCard';
import { usePermissions } from '@/lib/rbac/client';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { HomeAction } from '@/types';

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

/**
 * Tarjetas de acceso rápido del Home.
 *
 * Coincide con el wireframe: tres tarjetas de navegación.
 * Se filtran por permisos (RBAC) para mostrar solo opciones autorizadas.
 */
export const HomeActionCards = () => {
  const { permissions, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <section aria-label='Quick actions' className='grid grid-cols-3 gap-10'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='h-32 bg-muted animate-pulse rounded-lg' />
        ))}
      </section>
    );
  }

  const visibleActions = actions.filter((action) =>
    permissions.includes(action.permission)
  );

  return (
    <section aria-label='Quick actions' className='grid grid-cols-3 gap-10'>
      {visibleActions.map((action) => (
        <Link key={action.href} href={action.href} className='block'>
          <TitledCard
            className='h-full transition-colors hover:bg-accent'
            title={action.title}
            description={action.description}
            titleClassName='text-xl leading-snug'
          />
        </Link>
      ))}
    </section>
  );
};
