import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserMenuProps {
  session: {
    user: {
      name: string;
      email: string;
      image?: string | null;
    };
  };
  onLogout: () => void;
}

/**
 * Menú desplegable del usuario.
 * Muestra información del perfil y opción de cierre de sesión.
 */
export const UserMenu = ({ session, onLogout }: UserMenuProps) => {
  const name = session.user?.name ?? session.user?.email ?? 'Usuario';
  const image = session.user?.image ?? '';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase())
    .join('');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='relative h-9 w-9 rounded-full p-0 hover:bg-transparent'
        >
          <Avatar className='h-9 w-9 border border-border/50 shadow-sm transition-transform hover:scale-105'>
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className='bg-primary/5 text-primary text-xs font-bold'>
              {initials || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-semibold leading-none'>{name}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {session.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-destructive focus:text-destructive cursor-pointer'
          onClick={onLogout}
        >
          <LogOut className='mr-2 h-4 w-4' />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
