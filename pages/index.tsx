import Head from "next/head";

import { HomeHeader } from "@/components/organisms/HomeHeader";
import { HomeActionCards } from "@/components/organisms/HomeActionCards";
import { AppShell } from "@/components/templates/AppShell";

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
			<HomeHeader />
			<HomeActionCards />
		</AppShell>
	</>
);

export default Home;
