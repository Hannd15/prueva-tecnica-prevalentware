import { PageHeader } from '@/components/organisms/PageHeader';
import { HomeActionCards } from '@/components/organisms/HomeActionCards';
import { AppShell } from '@/components/templates/AppShell';

/**
 * Página de inicio.
 *
 * Presenta accesos a las 3 áreas principales de la aplicación.
 * Las opciones visibles se filtran por permisos.
 */
const Home = () => (
  <AppShell pageTitle='Home'>
    <PageHeader
      title='Bienvenido'
      subtitle='Selecciona una sección para empezar.'
    />
    <HomeActionCards />
  </AppShell>
);

export default Home;
