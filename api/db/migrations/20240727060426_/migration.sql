/*
  Warnings:

  - You are about to drop the column `organizationId` on the `ReportingPeriod` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReportingPeriod" DROP CONSTRAINT "ReportingPeriod_organizationId_fkey";

-- AlterTable
ALTER TABLE "ReportingPeriod" DROP COLUMN "organizationId";
