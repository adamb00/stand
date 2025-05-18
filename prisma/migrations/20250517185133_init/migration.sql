/*
  Warnings:

  - Added the required column `netUnitPrice` to the `PriceHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_restaurantId_fkey";

-- AlterTable
ALTER TABLE "PriceHistory" ADD COLUMN     "netUnitPrice" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "restaurantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
