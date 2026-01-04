import Link from 'next/link';

import { TitledCard } from '@/components/molecules/TitledCard';

type HomeAction = {
  title: string;
  description: string;
  href: string;
};

const actions: HomeAction[] = [
  {
    title: 'Gestión de ingresos y gastos',
    description: 'Registra ingresos/egresos y consulta movimientos.',
    href: '/movements',
  },
  {
    title: 'Gestión de usuarios',
    description: 'Administra usuarios y permisos.',
    href: '/users',
  },
  {
    title: 'Reportes',
    description: 'Visualiza el saldo y exporta el reporte.',
    href: '/reports',
  },
];

/**
 * Home page quick access cards.
 *
 * Matches the wireframe: three prominent navigation cards.
 */
export const HomeActionCards = () => (
  <section aria-label='Quick actions' className='grid grid-cols-3 gap-10'>
    {actions.map((action) => (
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
