/*
  Warnings:

  - You are about to drop the column `ueiTinCombo` on the `SubrecipientUpload` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ueiTinCombo]` on the table `Subrecipient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ueiTinCombo` to the `Subrecipient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadId` to the `SubrecipientUpload` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "SubrecipientUpload_ueiTinCombo_idx";

-- AlterTable
ALTER TABLE "Subrecipient" ADD COLUMN     "ueiTinCombo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubrecipientUpload" DROP COLUMN "ueiTinCombo",
ADD COLUMN     "uploadId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subrecipient_ueiTinCombo_key" ON "Subrecipient"("ueiTinCombo");

-- AddForeignKey
ALTER TABLE "SubrecipientUpload" ADD CONSTRAINT "SubrecipientUpload_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "Upload"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
