import type { ReactNode } from "react";

import { AppSidebar } from "@/components/organisms/AppSidebar";
import { cn } from "@/lib/utils";

export type AppShellProps = {
  children: ReactNode;
  className?: string;
  /**
   * Optional override for the main content wrapper.
   *
   * AppShell applies a default vertical rhythm (space between sections) so
   * individual pages don't need to repeat spacing utilities.
   */
  contentClassName?: string;
};

/**
 * Base application layout.
 *
 * Non-responsive by design (per the technical test notes).
 */
export const AppShell = ({ children, className, contentClassName }: AppShellProps) => (
  <div className={cn("min-h-screen bg-background", className)}>
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 p-12">
        <div className={cn("space-y-10", contentClassName)}>{children}</div>
      </main>
    </div>
  </div>
);
