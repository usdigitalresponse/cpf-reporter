/*
  Warnings:

  - You are about to drop the column `tenantId` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Agency" DROP CONSTRAINT "Agency_tenantId_fkey";

-- AlterTable
ALTER TABLE "Agency" DROP COLUMN "tenantId",
ADD COLUMN     "organizationId" INTEGER;

-- DropTable
DROP TABLE "Tenant";

-- CreateTable
CREATE TABLE "Organization" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
