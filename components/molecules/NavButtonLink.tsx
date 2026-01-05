import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type NavButtonLinkProps = {
  href: string;
  label: string;
  icon?: LucideIcon;
  className?: string;
};

/**
 * Botón de navegación del sidebar.
 *
 * Renderiza un `Button` (shadcn/ui) como enlace de ancho completo y marca
 * el estado activo comparando el `pathname` actual con el `href`.
 */
export const NavButtonLink = ({
  href,
  label,
  icon: Icon,
  className,
}: NavButtonLinkProps) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Button
      asChild
      variant='ghost'
      className={cn(
        'w-full justify-start gap-3 px-3 py-2 h-10 font-medium transition-all duration-200',
        isActive
          ? 'bg-secondary text-secondary-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
        className
      )}
    >
      <Link href={href}>
        {Icon && (
          <Icon
            className={cn(
              'h-4 w-4 shrink-0',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        )}
        <span>{label}</span>
      </Link>
    </Button>
  );
};
