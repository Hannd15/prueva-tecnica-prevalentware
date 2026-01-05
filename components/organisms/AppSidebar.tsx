import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  BarChart3,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { NavButtonLink } from '@/components/molecules/NavButtonLink';
import { usePermissions } from '@/lib/rbac/client';
import { PERMISSIONS } from '@/lib/rbac/permissions';
import { cn } from '@/lib/utils';

export type AppSidebarProps = {
  className?: string;
};

/**
 * Sidebar principal de la aplicación.
 *
 * Contiene la navegación primaria y oculta enlaces según permisos (RBAC).
 * Diseño minimalista inspirado en interfaces Fintech modernas.
 */
export const AppSidebar = ({ className }: AppSidebarProps) => {
  const { permissions, isLoading } = usePermissions();

  return (
    <aside
      className={cn(
        'w-72 shrink-0 border-r bg-card flex flex-col h-full transition-all duration-300',
        className
      )}
      aria-label='Navegación principal'
    >
      {/* Área de Logo / Marca */}
      <div className='h-16 flex items-center px-6 border-b mb-6'>
        <Link href='/' className='flex items-center gap-2.5 group'>
          <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105'>
            <Wallet className='h-5 w-5 text-primary-foreground' />
          </div>
          <span className='font-bold text-lg tracking-tight'>Finanzas</span>
        </Link>
      </div>

      <div className='flex-1 px-4 space-y-8'>
        {/* Grupo de Navegación Principal */}
        <div className='space-y-1'>
          <p className='px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70'>
            Menú Principal
          </p>

          {isLoading ? (
            <div className='space-y-2 px-2'>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className='h-9 bg-muted/50 rounded-md animate-pulse'
                />
              ))}
            </div>
          ) : (
            <nav className='space-y-1'>
              <NavButtonLink
                href='/'
                label='Dashboard'
                icon={LayoutDashboard}
              />
              {permissions.includes(PERMISSIONS.MOVEMENTS_READ) && (
                <NavButtonLink
                  href='/movements'
                  label='Movimientos'
                  icon={ArrowLeftRight}
                />
              )}
              {permissions.includes(PERMISSIONS.USERS_READ) && (
                <NavButtonLink href='/users' label='Usuarios' icon={Users} />
              )}
              {permissions.includes(PERMISSIONS.REPORTS_READ) && (
                <NavButtonLink
                  href='/reports'
                  label='Reportes'
                  icon={BarChart3}
                />
              )}
            </nav>
          )}
        </div>
      </div>
    </aside>
  );
};
