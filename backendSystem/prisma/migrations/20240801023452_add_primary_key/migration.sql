/*
  Warnings:

  - A unique constraint covering the columns `[chainId,txnHash]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transaction_chainId_txnHash_key" ON "Transaction"("chainId", "txnHash");
