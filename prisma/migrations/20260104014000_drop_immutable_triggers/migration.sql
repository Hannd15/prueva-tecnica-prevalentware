-- Remove immutability triggers; enforcement will be done at the application level.
DROP TRIGGER IF EXISTS "role_immutable" ON "role";
DROP TRIGGER IF EXISTS "permission_immutable" ON "permission";
DROP TRIGGER IF EXISTS "role_permission_immutable" ON "role_permission";

DROP FUNCTION IF EXISTS "reject_role_dml"();
DROP FUNCTION IF EXISTS "reject_permission_dml"();
DROP FUNCTION IF EXISTS "reject_role_permission_dml"();
