const { Queue, Worker } = require("bullmq");
const {
  redisConnection,
  retryMechanism,
  rateLimiter,
  stalledCountOpts,
} = require("../../../common");
const { createTransaction } = require("../../../utils/dbService");

const persistTxnsQueueName = "persistTxns";

const persistTxnsQueue = new Queue(persistTxnsQueueName, {
  ...redisConnection,
  ...retryMechanism,
});

const persistTxnsWorker = new Worker(
  persistTxnsQueueName,
  async (job) => {
    const { poolAddress, txnData, priceInUSDT, priceInETH, price } = job.data;
    let chainId = 1;

    // interact with the database
    // persist txnData and price
    await createTransaction(
      chainId,
      poolAddress,
      txnData.txnHash,
      parseFloat(priceInUSDT),
      parseFloat(priceInETH),
      parseFloat(price),
      txnData.timeStamp
    );

    // job done
    return true;
  },
  {
    ...redisConnection,
    ...stalledCountOpts,
  }
);

module.exports = {
  persistTxnsQueue,
  persistTxnsWorker,
};
