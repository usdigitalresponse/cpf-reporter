/*
  Warnings:

  - You are about to drop the column `agencyId` on the `UploadValidation` table. All the data in the column will be lost.
  - You are about to drop the column `inputTemplateId` on the `UploadValidation` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `UploadValidation` table. All the data in the column will be lost.
  - You are about to drop the column `validationResults` on the `UploadValidation` table. All the data in the column will be lost.
  - Added the required column `initiatedById` to the `UploadValidation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passed` to the `UploadValidation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UploadValidation" DROP CONSTRAINT "UploadValidation_agencyId_fkey";

-- DropForeignKey
ALTER TABLE "UploadValidation" DROP CONSTRAINT "UploadValidation_inputTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "UploadValidation" DROP CONSTRAINT "UploadValidation_organizationId_fkey";

-- AlterTable
ALTER TABLE "UploadValidation" DROP COLUMN "agencyId",
DROP COLUMN "inputTemplateId",
DROP COLUMN "organizationId",
DROP COLUMN "validationResults",
ADD COLUMN     "initiatedById" INTEGER NOT NULL,
ADD COLUMN     "passed" BOOLEAN NOT NULL,
ADD COLUMN     "results" JSONB;

-- AddForeignKey
ALTER TABLE "UploadValidation" ADD CONSTRAINT "UploadValidation_initiatedById_fkey" FOREIGN KEY ("initiatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
