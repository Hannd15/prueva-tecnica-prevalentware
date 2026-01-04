import { PageHeader } from '@/components/organisms/PageHeader';

export type HomeHeaderProps = {
  title?: string;
  subtitle?: string;
};

/**
 * Home header wrapper.
 *
 * Prefer using `PageHeader` directly in new pages.
 */
export const HomeHeader = ({
  title = 'Bienvenido',
  subtitle = 'Selecciona una sección para empezar.',
}: HomeHeaderProps) => <PageHeader title={title} subtitle={subtitle} />;
