-- DropForeignKey
ALTER TABLE "Upload" DROP CONSTRAINT "Upload_expenditureCategoryId_fkey";

-- AlterTable
ALTER TABLE "Upload" ALTER COLUMN "expenditureCategoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Upload" ADD CONSTRAINT "Upload_expenditureCategoryId_fkey" FOREIGN KEY ("expenditureCategoryId") REFERENCES "ExpenditureCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
