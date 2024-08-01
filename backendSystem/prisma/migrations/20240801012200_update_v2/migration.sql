/*
  Warnings:

  - Added the required column `ethPriceAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceInETH` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "ethPriceAt" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "priceInETH" DOUBLE PRECISION NOT NULL;
