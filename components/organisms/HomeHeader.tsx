import { PageHeader } from '@/components/organisms/PageHeader';

export type HomeHeaderProps = {
  title?: string;
  subtitle?: string;
};

/**
 * Wrapper de encabezado para el Home.
 *
 * En páginas nuevas, preferir usar `PageHeader` directamente.
 */
export const HomeHeader = ({
  title = 'Bienvenido',
  subtitle = 'Selecciona una sección para empezar.',
}: HomeHeaderProps) => <PageHeader title={title} subtitle={subtitle} />;
