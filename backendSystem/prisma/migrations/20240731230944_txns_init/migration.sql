-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "chainId" INTEGER NOT NULL,
    "poolAddress" TEXT NOT NULL,
    "txnHash" TEXT NOT NULL,
    "priceInUSDT" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txnTimestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
