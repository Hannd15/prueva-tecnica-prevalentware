import Link from "next/link";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NavButtonLinkProps = {
  href: string;
  label: string;
  className?: string;
};

/**
 * Sidebar navigation button.
 *
 * Uses a Shadcn Button styled as a full-width link.
 */
export const NavButtonLink = ({ href, label, className }: NavButtonLinkProps) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "outline"}
      className={cn("w-full justify-start", className)}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
