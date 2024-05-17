/*
  Warnings:

  - You are about to drop the column `certifiedAt` on the `ReportingPeriod` table. All the data in the column will be lost.
  - You are about to drop the column `certifiedById` on the `ReportingPeriod` table. All the data in the column will be lost.
  - You are about to drop the column `isCurrentPeriod` on the `ReportingPeriod` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `ReportingPeriod` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReportingPeriod" DROP CONSTRAINT "ReportingPeriod_certifiedById_fkey";

-- DropForeignKey
ALTER TABLE "ReportingPeriod" DROP CONSTRAINT "ReportingPeriod_organizationId_fkey";

-- AlterTable
ALTER TABLE "ReportingPeriod" DROP COLUMN "certifiedAt",
DROP COLUMN "certifiedById",
DROP COLUMN "isCurrentPeriod",
DROP COLUMN "organizationId";
