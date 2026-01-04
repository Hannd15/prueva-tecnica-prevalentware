/*
  Warnings:

  - Added the required column `type` to the `movement` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('INCOME', 'EXPENSE');

-- AlterTable
ALTER TABLE "movement" ADD COLUMN     "type" "MovementType" NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "permission" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "role" ALTER COLUMN "updatedAt" DROP DEFAULT;
