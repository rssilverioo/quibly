-- CreateEnum
CREATE TYPE "Language" AS ENUM ('PT', 'EN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'PT';
