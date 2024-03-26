-- DropForeignKey
ALTER TABLE "UploadValidation" DROP CONSTRAINT "UploadValidation_uploadId_fkey";

-- AddForeignKey
ALTER TABLE "UploadValidation" ADD CONSTRAINT "UploadValidation_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "Upload"("id") ON DELETE CASCADE ON UPDATE CASCADE;
