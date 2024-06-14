/*
  Warnings:

  - You are about to drop the column `certifiedAt` on the `Subrecipient` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Subrecipient` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Subrecipient` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubrecipientStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterEnum
ALTER TYPE "Version" ADD VALUE 'V2024_05_24';

-- AlterTable
ALTER TABLE "Subrecipient" DROP COLUMN "certifiedAt",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "status" "SubrecipientStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "SubrecipientUpload" (
    "id" SERIAL NOT NULL,
    "subrecipientId" INTEGER NOT NULL,
    "ueiTinCombo" TEXT NOT NULL,
    "rawSubrecipient" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" "Version" NOT NULL,

    CONSTRAINT "SubrecipientUpload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubrecipientUpload_ueiTinCombo_idx" ON "SubrecipientUpload"("ueiTinCombo");

-- AddForeignKey
ALTER TABLE "SubrecipientUpload" ADD CONSTRAINT "SubrecipientUpload_subrecipientId_fkey" FOREIGN KEY ("subrecipientId") REFERENCES "Subrecipient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
