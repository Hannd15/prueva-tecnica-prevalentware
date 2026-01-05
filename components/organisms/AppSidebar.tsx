import { NavButtonLink } from '@/components/molecules/NavButtonLink';
import { usePermissions } from '@/lib/rbac/client';
import { PERMISSIONS } from '@/lib/rbac/permissions';

export type AppSidebarProps = {
  className?: string;
};

/**
 * Sidebar principal de la aplicación.
 *
 * Contiene la navegación primaria y oculta enlaces según permisos (RBAC)
 * para evitar que el usuario navegue a páginas no autorizadas.
 */
export const AppSidebar = ({ className }: AppSidebarProps) => {
  const { permissions, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <aside
        className={className ?? 'w-72 shrink-0 border-r bg-muted/40 p-4'}
        aria-label='Main navigation'
      >
        <div className='space-y-2 animate-pulse'>
          <div className='h-10 bg-muted rounded' />
          <div className='h-10 bg-muted rounded' />
          <div className='h-10 bg-muted rounded' />
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={className ?? 'w-72 shrink-0 border-r bg-muted/40 p-4'}
      aria-label='Main navigation'
    >
      <nav className='space-y-2'>
        {permissions.includes(PERMISSIONS.MOVEMENTS_READ) && (
          <NavButtonLink
            href='/movements'
            label='Gestión de ingresos y gastos'
          />
        )}
        {permissions.includes(PERMISSIONS.USERS_READ) && (
          <NavButtonLink href='/users' label='Gestión de usuarios' />
        )}
        {permissions.includes(PERMISSIONS.REPORTS_READ) && (
          <NavButtonLink href='/reports' label='Reportes' />
        )}
      </nav>
    </aside>
  );
};
