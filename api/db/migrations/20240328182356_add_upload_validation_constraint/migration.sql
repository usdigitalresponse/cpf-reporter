CREATE UNIQUE INDEX "UploadValidation_unique_null_results_per_uploadid" ON "UploadValidation"("uploadId") WHERE results IS NULL;
