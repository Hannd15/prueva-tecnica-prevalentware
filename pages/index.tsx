import { PageHeader } from '@/components/organisms/PageHeader';
import { HomeActionCards } from '@/components/organisms/HomeActionCards';
import { AppShell } from '@/components/templates/AppShell';

/**
 * Home page.
 *
 * Presents top-level navigation into the three app areas.
 * Authentication/authorization will be added later.
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
