/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Agency` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Agency_name_key" ON "Agency"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");
