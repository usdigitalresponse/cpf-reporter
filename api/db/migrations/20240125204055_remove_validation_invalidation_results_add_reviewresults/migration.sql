/*
  Warnings:

  - You are about to drop the column `invalidationResults` on the `UploadValidation` table. All the data in the column will be lost.
  - You are about to drop the column `validationResults` on the `UploadValidation` table. All the data in the column will be lost.
  - Made the column `reviewedAt` on table `UploadValidation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UploadValidation" DROP COLUMN "invalidationResults",
DROP COLUMN "validationResults",
ADD COLUMN     "reviewResults" JSONB,
ALTER COLUMN "reviewedAt" SET NOT NULL,
ALTER COLUMN "reviewedAt" SET DEFAULT CURRENT_TIMESTAMP;
