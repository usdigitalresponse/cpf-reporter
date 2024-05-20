-- AlterTable
ALTER TABLE "ReportingPeriod" ADD COLUMN     "validationRulesId" INTEGER;

-- AddForeignKey
ALTER TABLE "ReportingPeriod" ADD CONSTRAINT "ReportingPeriod_validationRulesId_fkey" FOREIGN KEY ("validationRulesId") REFERENCES "ValidationRules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
