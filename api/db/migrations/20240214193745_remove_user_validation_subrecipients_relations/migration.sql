/*
  Warnings:

  - You are about to drop the column `certifiedById` on the `Subrecipient` table. All the data in the column will be lost.
  - You are about to drop the column `invalidatedById` on the `UploadValidation` table. All the data in the column will be lost.
  - You are about to drop the column `validatedById` on the `UploadValidation` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `User` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `agencyId` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Subrecipient" DROP CONSTRAINT "Subrecipient_certifiedById_fkey";

-- DropForeignKey
ALTER TABLE "UploadValidation" DROP CONSTRAINT "UploadValidation_invalidatedById_fkey";

-- DropForeignKey
ALTER TABLE "UploadValidation" DROP CONSTRAINT "UploadValidation_validatedById_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_agencyId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- AlterTable
ALTER TABLE "Subrecipient" DROP COLUMN "certifiedById";

-- AlterTable
ALTER TABLE "UploadValidation" DROP COLUMN "invalidatedById",
DROP COLUMN "validatedById";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "organizationId",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "agencyId" SET NOT NULL,
ALTER COLUMN "role" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
