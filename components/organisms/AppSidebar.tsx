import { NavButtonLink } from '@/components/molecules/NavButtonLink';

export type AppSidebarProps = {
  className?: string;
};

/**
 * Main application sidebar.
 *
 * Contains primary navigation used across all pages.
 */
export const AppSidebar = ({ className }: AppSidebarProps) => (
  <aside
    className={className ?? 'w-72 shrink-0 border-r bg-muted/40 p-4'}
    aria-label='Main navigation'
  >
    <nav className='space-y-2'>
      <NavButtonLink href='/movements' label='Gestión de ingresos y gastos' />
      <NavButtonLink href='/users' label='Usuarios' />
      <NavButtonLink href='/reports' label='Reportes' />
    </nav>
  </aside>
);
