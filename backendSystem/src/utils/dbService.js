const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createTransaction = async (
  chainId,
  poolAddress,
  txnHash,
  priceInUSDT,
  priceInETH,
  ethPriceAt,
  txnTimestamp
) => {
  try {
    // Convert epoch timestamp to Date object
    const txnDate = new Date(txnTimestamp * 1000); // Convert seconds to milliseconds

    const txnDataToStore = {
      chainId,
      poolAddress,
      txnHash,
      priceInUSDT,
      priceInETH,
      ethPriceAt,
      txnTimestamp: txnDate,
    };
    const transaction = await prisma.transaction.upsert({
      where: {
        chainId_txnHash: {
          // Assuming you have a composite unique constraint on txnHash and chainId
          chainId,
          txnHash,
        },
      },
      create: txnDataToStore,
      update: txnDataToStore,
    });

    return transaction;
  } catch (error) {
    throw new Error(`Error creating transaction: ${error.message}`);
  }
};

module.exports = {
  createTransaction,
};
