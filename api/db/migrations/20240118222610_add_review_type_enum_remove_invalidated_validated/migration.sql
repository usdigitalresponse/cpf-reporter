/*
  Warnings:

  - You are about to drop the column `invalidatedAt` on the `UploadValidation` table. All the data in the column will be lost.
  - You are about to drop the column `invalidatedById` on the `UploadValidation` table. All the data in the column will be lost.
  - You are about to drop the column `validatedAt` on the `UploadValidation` table. All the data in the column will be lost.
  - You are about to drop the column `validatedById` on the `UploadValidation` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReviewType" AS ENUM ('VALIDATED', 'INVALIDATED');

-- DropForeignKey
ALTER TABLE "UploadValidation" DROP CONSTRAINT "UploadValidation_invalidatedById_fkey";

-- DropForeignKey
ALTER TABLE "UploadValidation" DROP CONSTRAINT "UploadValidation_validatedById_fkey";

-- AlterTable
ALTER TABLE "UploadValidation" DROP COLUMN "invalidatedAt",
DROP COLUMN "invalidatedById",
DROP COLUMN "validatedAt",
DROP COLUMN "validatedById",
ADD COLUMN     "reviewType" "ReviewType",
ADD COLUMN     "reviewedAt" TIMESTAMPTZ(6),
ADD COLUMN     "reviewedById" INTEGER;

-- AddForeignKey
ALTER TABLE "UploadValidation" ADD CONSTRAINT "UploadValidation_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
