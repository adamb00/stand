/*
  Warnings:

  - You are about to drop the column `unitId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `measerumentUnitId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_unitId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "unitId",
ADD COLUMN     "measerumentUnitId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_measerumentUnitId_fkey" FOREIGN KEY ("measerumentUnitId") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
