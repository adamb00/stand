/*
  Warnings:

  - You are about to drop the column `measurementUnitId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `InboundItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InboundShipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MeasurementUnit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Outbound` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OutboundItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transfer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransferItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Unit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `unit` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INBOUND', 'OUTBOUND');

-- DropForeignKey
ALTER TABLE "InboundItem" DROP CONSTRAINT "InboundItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "InboundItem" DROP CONSTRAINT "InboundItem_shipmentId_fkey";

-- DropForeignKey
ALTER TABLE "InboundShipment" DROP CONSTRAINT "InboundShipment_unitId_fkey";

-- DropForeignKey
ALTER TABLE "InboundShipment" DROP CONSTRAINT "InboundShipment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Outbound" DROP CONSTRAINT "Outbound_unitId_fkey";

-- DropForeignKey
ALTER TABLE "Outbound" DROP CONSTRAINT "Outbound_userId_fkey";

-- DropForeignKey
ALTER TABLE "OutboundItem" DROP CONSTRAINT "OutboundItem_outboundId_fkey";

-- DropForeignKey
ALTER TABLE "OutboundItem" DROP CONSTRAINT "OutboundItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_measurementUnitId_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_productId_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_unitId_fkey";

-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_fromUnitId_fkey";

-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_toUnitId_fkey";

-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_userId_fkey";

-- DropForeignKey
ALTER TABLE "TransferItem" DROP CONSTRAINT "TransferItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "TransferItem" DROP CONSTRAINT "TransferItem_transferId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_unitId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "measurementUnitId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "unit" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "unitId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "restaurantId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "InboundItem";

-- DropTable
DROP TABLE "InboundShipment";

-- DropTable
DROP TABLE "MeasurementUnit";

-- DropTable
DROP TABLE "Outbound";

-- DropTable
DROP TABLE "OutboundItem";

-- DropTable
DROP TABLE "Stock";

-- DropTable
DROP TABLE "Transfer";

-- DropTable
DROP TABLE "TransferItem";

-- DropTable
DROP TABLE "Unit";

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3),

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryPeriod" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryLine" (
    "id" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "openingQuantity" DECIMAL(65,30) NOT NULL,
    "closingQuantity" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryTransaction" (
    "id" TEXT NOT NULL,
    "lineId" TEXT NOT NULL,
    "restaurantId" TEXT,
    "type" "TransactionType" NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InventoryPeriod_restaurantId_year_month_key" ON "InventoryPeriod"("restaurantId", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryLine_periodId_productId_key" ON "InventoryLine"("periodId", "productId");

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryPeriod" ADD CONSTRAINT "InventoryPeriod_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLine" ADD CONSTRAINT "InventoryLine_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "InventoryPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryLine" ADD CONSTRAINT "InventoryLine_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_lineId_fkey" FOREIGN KEY ("lineId") REFERENCES "InventoryLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
