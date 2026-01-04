import Head from 'next/head';

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
  <>
    <Head>
      <title>Home | Prueba Técnica</title>
    </Head>

    <AppShell>
      <PageHeader
        title='Bienvenido'
        subtitle='Selecciona una sección para empezar.'
      />
      <HomeActionCards />
    </AppShell>
  </>
);

export default Home;
