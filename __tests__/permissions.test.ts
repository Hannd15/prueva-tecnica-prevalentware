import { hasAllPermissions, PERMISSIONS } from '@/lib/rbac/permissions';

describe('RBAC Permissions', () => {
  it('should return true if user has all required permissions', () => {
    const userPerms = [PERMISSIONS.MOVEMENTS_READ, PERMISSIONS.REPORTS_READ];
    const required = [PERMISSIONS.MOVEMENTS_READ];
    expect(hasAllPermissions(userPerms, required)).toBe(true);
  });

  it('should return false if user is missing a required permission', () => {
    const userPerms = [PERMISSIONS.MOVEMENTS_READ];
    const required = [PERMISSIONS.MOVEMENTS_READ, PERMISSIONS.REPORTS_READ];
    expect(hasAllPermissions(userPerms, required)).toBe(false);
  });

  it('should return true if no permissions are required', () => {
    const userPerms = [PERMISSIONS.MOVEMENTS_READ];
    const required: string[] = [];
    expect(hasAllPermissions(userPerms, required)).toBe(true);
  });
});
