/*
  Warnings:

  - You are about to drop the column `invoiceNetUnitPrice` on the `PriceHistory` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceUnitPrice` on the `PriceHistory` table. All the data in the column will be lost.
  - You are about to drop the column `validTo` on the `PriceHistory` table. All the data in the column will be lost.
  - Added the required column `hasPriceDifference` to the `PriceHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PriceHistory" DROP COLUMN "invoiceNetUnitPrice",
DROP COLUMN "invoiceUnitPrice",
DROP COLUMN "validTo",
ADD COLUMN     "hasPriceDifference" BOOLEAN NOT NULL,
ADD COLUMN     "priceDifference" DECIMAL(65,30);
