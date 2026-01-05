-- Remove MOVEMENTS_CREATE permission from USER role
DELETE FROM "role_permission" 
WHERE "roleId" = 'role_user' AND "permissionId" = 'perm_movements_create';
