/*
  Warnings:

  - You are about to drop the column `address` on the `Receiver` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Receiver` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Receiver` table. All the data in the column will be lost.
  - Added the required column `address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "Receiver" DROP COLUMN "address",
DROP COLUMN "latitude",
DROP COLUMN "longitude";
