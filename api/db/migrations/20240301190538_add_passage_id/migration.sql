-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passageId" TEXT;

-- CreateIndex
CREATE INDEX "User_passageId_idx" ON "User"("passageId");
