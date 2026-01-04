-- Role assignment is enforced by application code (Better Auth databaseHooks)
-- so the database should not default the roleId.
ALTER TABLE "user" ALTER COLUMN "roleId" DROP DEFAULT;
