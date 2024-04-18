/*
  Warnings:

  - You are about to drop the column `originationUploadId` on the `Subrecipient` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Upload` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subrecipient" DROP CONSTRAINT "Subrecipient_originationUploadId_fkey";

-- DropForeignKey
ALTER TABLE "Upload" DROP CONSTRAINT "Upload_organizationId_fkey";

-- AlterTable
ALTER TABLE "Subrecipient" DROP COLUMN "originationUploadId";

-- AlterTable
ALTER TABLE "Upload" DROP COLUMN "organizationId";
