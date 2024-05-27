/*
  Warnings:

  - You are about to drop the column `certifiedAt` on the `ReportingPeriod` table. All the data in the column will be lost.
  - You are about to drop the column `certifiedById` on the `ReportingPeriod` table. All the data in the column will be lost.
  - You are about to drop the column `isCurrentPeriod` on the `ReportingPeriod` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReportingPeriod" DROP CONSTRAINT "ReportingPeriod_certifiedById_fkey";

-- AlterTable
ALTER TABLE "ReportingPeriod" DROP COLUMN "certifiedAt",
DROP COLUMN "certifiedById",
DROP COLUMN "isCurrentPeriod",
ADD COLUMN     "validationRulesId" INTEGER;

-- AddForeignKey
ALTER TABLE "ReportingPeriod" ADD CONSTRAINT "ReportingPeriod_validationRulesId_fkey" FOREIGN KEY ("validationRulesId") REFERENCES "ValidationRules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
