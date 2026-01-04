export const PERMISSIONS = {
  MOVEMENTS_READ: 'MOVEMENTS_READ',
  MOVEMENTS_CREATE: 'MOVEMENTS_CREATE',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const hasAllPermissions = (
  userPermissions: readonly string[],
  required: readonly string[]
) => required.every((permission) => userPermissions.includes(permission));
