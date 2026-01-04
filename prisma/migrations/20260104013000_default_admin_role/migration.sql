-- NOTE: Role assignment is enforced by application code (Better Auth databaseHooks).
-- Keep the database neutral (no default).
ALTER TABLE "user" ALTER COLUMN "roleId" DROP DEFAULT;
