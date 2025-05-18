/*
  Warnings:

  - You are about to drop the column `measerumentUnitId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `measurementUnitId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_measerumentUnitId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "measerumentUnitId",
ADD COLUMN     "measurementUnitId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_measurementUnitId_fkey" FOREIGN KEY ("measurementUnitId") REFERENCES "MeasurementUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
