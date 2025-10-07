/*
  Warnings:

  - Added the required column `updatedAt` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Quiz" DROP CONSTRAINT "Quiz_documentId_fkey";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "subject" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" ALTER COLUMN "documentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "photoUrl" TEXT;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
