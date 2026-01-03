import Link from "next/link";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type HomeAction = {
  title: string;
  description: string;
  href: string;
};

const actions: HomeAction[] = [
  {
    title: "Gestión de ingresos y gastos",
    description: "Registra ingresos/egresos y consulta movimientos.",
    href: "/movements",
  },
  {
    title: "Gestión de usuarios",
    description: "Administra usuarios y permisos.",
    href: "/users",
  },
  {
    title: "Reportes",
    description: "Visualiza el saldo y exporta el reporte.",
    href: "/reports",
  },
];

/**
 * Home page quick access cards.
 *
 * Matches the wireframe: three prominent navigation cards.
 */
export const HomeActionCards = () => (
  <section aria-label="Quick actions" className="grid grid-cols-3 gap-10">
    {actions.map((action) => (
      <Link key={action.href} href={action.href} className="block">
        <Card className="h-full transition-colors hover:bg-accent">
          <CardHeader>
            <CardTitle className="text-xl leading-snug">{action.title}</CardTitle>
            <CardDescription>{action.description}</CardDescription>
          </CardHeader>
        </Card>
      </Link>
    ))}
  </section>
);
