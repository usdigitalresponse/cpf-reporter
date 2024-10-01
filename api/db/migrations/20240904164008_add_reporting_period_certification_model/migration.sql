-- CreateTable
CREATE TABLE "ReportingPeriodCertification" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "reportingPeriodId" INTEGER NOT NULL,
    "certifiedById" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportingPeriodCertification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReportingPeriodCertification_organizationId_reportingPeriod_key" ON "ReportingPeriodCertification"("organizationId", "reportingPeriodId");

-- AddForeignKey
ALTER TABLE "ReportingPeriodCertification" ADD CONSTRAINT "ReportingPeriodCertification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportingPeriodCertification" ADD CONSTRAINT "ReportingPeriodCertification_reportingPeriodId_fkey" FOREIGN KEY ("reportingPeriodId") REFERENCES "ReportingPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportingPeriodCertification" ADD CONSTRAINT "ReportingPeriodCertification_certifiedById_fkey" FOREIGN KEY ("certifiedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
