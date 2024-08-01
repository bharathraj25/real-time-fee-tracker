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

    const transaction = await prisma.transaction.create({
      data: {
        chainId,
        poolAddress,
        txnHash,
        priceInUSDT,
        priceInETH,
        ethPriceAt,
        txnTimestamp: txnDate,
      },
    });
    // console.log("Transaction created:", transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
  }
};

module.exports = {
  createTransaction,
};
