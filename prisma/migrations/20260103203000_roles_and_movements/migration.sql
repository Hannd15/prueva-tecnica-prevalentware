-- Add role to users (default ADMIN for test convenience)
ALTER TABLE "user" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'ADMIN';

-- Create movements table
CREATE TABLE "movement" (
    "id" TEXT NOT NULL,
    "concept" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movement_pkey" PRIMARY KEY ("id")
);

-- Foreign key
ALTER TABLE "movement" ADD CONSTRAINT "movement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Indexes
CREATE INDEX "movement_userId_idx" ON "movement"("userId");
CREATE INDEX "movement_date_idx" ON "movement"("date");
