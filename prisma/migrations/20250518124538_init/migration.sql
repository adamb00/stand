/*
  Warnings:

  - Changed the type of `unit` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Unit" AS ENUM ('LITER', 'ÜVEG', 'CSOMAG', 'KG');

-- AlterTable
ALTER TABLE "InventoryLine" ADD COLUMN     "sellingUnitPrice" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "InventoryTransaction" ADD COLUMN     "actualNetUnitPrice" DECIMAL(65,30),
ADD COLUMN     "expectedNetUnitPrice" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "PriceHistory" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "invoiceNetUnitPrice" DECIMAL(65,30),
ADD COLUMN     "invoiceUnitPrice" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "unit",
ADD COLUMN     "unit" "Unit" NOT NULL;

-- CreateIndex
CREATE INDEX "InventoryTransaction_lineId_idx" ON "InventoryTransaction"("lineId");

-- CreateIndex
CREATE INDEX "InventoryTransaction_restaurantId_idx" ON "InventoryTransaction"("restaurantId");

-- CreateIndex
CREATE INDEX "PriceHistory_productId_validFrom_idx" ON "PriceHistory"("productId", "validFrom");
