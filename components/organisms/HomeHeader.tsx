export type HomeHeaderProps = {
  title?: string;
  subtitle?: string;
};

/**
 * Home page header.
 *
 * Extracted to keep the page component focused on composition.
 * Defaults match the wireframe intent.
 */
export const HomeHeader = ({
  title = "Bienvenido",
  subtitle = "Selecciona una sección para empezar.",
}: HomeHeaderProps) => (
  <header className="space-y-2">
    <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
    <p className="text-muted-foreground">{subtitle}</p>
  </header>
);
