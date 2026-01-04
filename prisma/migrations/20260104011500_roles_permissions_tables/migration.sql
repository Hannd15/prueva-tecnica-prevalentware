-- Create roles table
CREATE TABLE "role" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- Create permissions table
CREATE TABLE "permission" (
        "id" TEXT NOT NULL,
        "key" TEXT NOT NULL,
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "permission_key_key" ON "permission"("key");

-- Create role_permission join table
CREATE TABLE "role_permission" (
        "roleId" TEXT NOT NULL,
        "permissionId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "role_permission_pkey" PRIMARY KEY ("roleId","permissionId")
);

ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "role_permission_permissionId_idx" ON "role_permission"("permissionId");

-- Seed fixed roles
INSERT INTO "role" ("id", "name", "description") VALUES
    ('role_admin', 'ADMIN', 'Full access'),
    ('role_user', 'USER', 'Limited access')
ON CONFLICT ("name") DO NOTHING;

-- Seed fixed permissions (keep this list minimal to current app scope)
INSERT INTO "permission" ("id", "key", "description") VALUES
    ('perm_movements_read', 'MOVEMENTS_READ', 'Can view movements'),
    ('perm_movements_create', 'MOVEMENTS_CREATE', 'Can create movements')
ON CONFLICT ("key") DO NOTHING;

-- Seed role-permission mapping
-- ADMIN has all permissions
INSERT INTO "role_permission" ("roleId", "permissionId")
SELECT 'role_admin', p."id" FROM "permission" p
ON CONFLICT DO NOTHING;

-- USER has a subset
INSERT INTO "role_permission" ("roleId", "permissionId") VALUES
    ('role_user', 'perm_movements_read'),
    ('role_user', 'perm_movements_create')
ON CONFLICT DO NOTHING;

-- Update user table to reference roles table
ALTER TABLE "user" ADD COLUMN "roleId" TEXT NOT NULL DEFAULT 'role_user';

-- Drop the legacy enum/text role column if it exists.
ALTER TABLE "user" DROP COLUMN IF EXISTS "role";

ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "user_roleId_idx" ON "user"("roleId");

-- Enforce immutability: block edits to fixed lookup tables.
CREATE OR REPLACE FUNCTION "reject_role_dml"() RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'role table is immutable';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION "reject_permission_dml"() RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'permission table is immutable';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION "reject_role_permission_dml"() RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'role_permission table is immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "role_immutable" BEFORE INSERT OR UPDATE OR DELETE ON "role"
FOR EACH ROW EXECUTE FUNCTION "reject_role_dml"();

CREATE TRIGGER "permission_immutable" BEFORE INSERT OR UPDATE OR DELETE ON "permission"
FOR EACH ROW EXECUTE FUNCTION "reject_permission_dml"();

CREATE TRIGGER "role_permission_immutable" BEFORE INSERT OR UPDATE OR DELETE ON "role_permission"
FOR EACH ROW EXECUTE FUNCTION "reject_role_permission_dml"();
