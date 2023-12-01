-- DropForeignKey
ALTER TABLE "Agency" DROP CONSTRAINT "Agency_tenantId_fkey";

-- AlterTable
ALTER TABLE "Agency" ALTER COLUMN "tenantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
