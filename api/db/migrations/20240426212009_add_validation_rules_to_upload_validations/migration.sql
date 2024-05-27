-- CreateEnum
CREATE TYPE "Version" AS ENUM ('V2023_12_12', 'V2024_01_07', 'V2024_04_01');

-- AlterTable
ALTER TABLE "UploadValidation" ADD COLUMN     "validationRulesId" INTEGER;

-- CreateTable
CREATE TABLE "ValidationRules" (
    "id" SERIAL NOT NULL,
    "versionId" "Version" NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ValidationRules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UploadValidation" ADD CONSTRAINT "UploadValidation_validationRulesId_fkey" FOREIGN KEY ("validationRulesId") REFERENCES "ValidationRules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
