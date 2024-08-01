const { Queue, Worker } = require("bullmq");
const {
  redisConnection,
  retryMechanism,
  rateLimiter,
  stalledCountOpts,
} = require("../../../common");
const { getClosePrice } = require("../../../utils/externalPriceFeeder");
const { persistTxnsQueue } = require("../persistTxns");

const priceFeedQueueName = "priceFeeder";

const priceFeedQueue = new Queue(priceFeedQueueName, {
  ...redisConnection,
  ...retryMechanism,
});

const priceFeedWorker = new Worker(
  priceFeedQueueName,
  async (job) => {
    const { poolAddress, symbol, interval, txnData, txnJobName } = job.data;
    const timestamp = txnData.timeStamp * 1000;
    const gasUsed = txnData.gasUsed;
    const gasPrice = txnData.gasPrice;

    // in Wei to ETH
    const txnFeeInETH = (Number(gasUsed) * Number(gasPrice)) / 1e18;

    job.log(`Txn fee in ETH: ${gasUsed} * ${gasPrice} = ${txnFeeInETH}`);

    job.log(`Getting price for ${(symbol, timestamp)}`);
    const price = await getClosePrice(symbol, timestamp, interval);

    job.log(`Price for ${symbol} at ${timestamp} is ${price}`);

    // calculate price in USDT
    const txnFeeInUSDT = txnFeeInETH * price;

    job.log(`Txn fee in USDT: ${txnFeeInETH} * ${price} = ${txnFeeInUSDT}`);

    const persistTxn = {
      txnHash: txnData.hash,
      timeStamp: txnData.timeStamp,
    };

    job.log(`Persisting txn: ${JSON.stringify(persistTxn)}`);

    // add new job to persistTxnsQueue
    const persistJobName = `${txnJobName}:persist`;
    await persistTxnsQueue.add(persistJobName, {
      poolAddress,
      txnData: persistTxn,
      priceInUSDT: txnFeeInUSDT,
      priceInETH: txnFeeInETH,
      price,
    });

    return txnFeeInUSDT;
  },
  {
    ...redisConnection,
    limiter: {
      max: 10,
      duration: 10000,
    },
    ...stalledCountOpts,
  }
);

module.exports = {
  priceFeedQueue,
  priceFeedWorker,
};
