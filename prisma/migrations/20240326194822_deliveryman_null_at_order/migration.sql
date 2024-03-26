-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_deliverymanId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "deliverymanId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deliverymanId_fkey" FOREIGN KEY ("deliverymanId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
