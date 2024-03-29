/*
  Warnings:

  - You are about to drop the column `invalidatedAt` on the `UploadValidation` table. All the data in the column will be lost.
  - You are about to drop the column `invalidationResults` on the `UploadValidation` table. All the data in the column will be lost.
  - You are about to drop the column `validatedAt` on the `UploadValidation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UploadValidation" DROP COLUMN "invalidatedAt",
DROP COLUMN "invalidationResults",
DROP COLUMN "validatedAt";
