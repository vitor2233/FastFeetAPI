/*
  Warnings:

  - You are about to drop the column `cep` on the `Receiver` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Receiver` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `Receiver` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Receiver` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Receiver` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `Receiver` table. All the data in the column will be lost.
  - Added the required column `address` to the `Receiver` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Receiver" DROP COLUMN "cep",
DROP COLUMN "city",
DROP COLUMN "district",
DROP COLUMN "number",
DROP COLUMN "state",
DROP COLUMN "street",
ADD COLUMN     "address" TEXT NOT NULL;
