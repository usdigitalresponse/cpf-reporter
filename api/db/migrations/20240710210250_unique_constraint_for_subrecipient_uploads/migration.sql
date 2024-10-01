/*
  Warnings:

  - A unique constraint covering the columns `[subrecipientId,uploadId]` on the table `SubrecipientUpload` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SubrecipientUpload_subrecipientId_uploadId_key" ON "SubrecipientUpload"("subrecipientId", "uploadId");
