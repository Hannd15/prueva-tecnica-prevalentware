import { useEffect, useMemo, useState } from 'react';

import { hasAllPermissions } from '@/lib/rbac/permissions';

type PermissionsResponse = { permissions: string[] };
type ErrorBody = { error?: string };

export const usePermissions = (options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true;

  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setPermissions([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/me/permissions', {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as ErrorBody | null;
          throw new Error(body?.error ?? `Error ${res.status}`);
        }

        const json = (await res.json()) as PermissionsResponse;
        if (!cancelled) setPermissions(json.permissions ?? []);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Error desconocido');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const api = useMemo(
    () => ({
      permissions,
      isLoading,
      error,
      hasAll: (required: readonly string[]) =>
        hasAllPermissions(permissions, required),
      can: (permission: string) => permissions.includes(permission),
    }),
    [permissions, isLoading, error]
  );

  return api;
};
