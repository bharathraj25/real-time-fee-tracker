const { Queue, Worker } = require("bullmq");
const {
  redisConnection,
  retryMechanism,
  rateLimiter,
} = require("../../../common");
const { getClosePrice } = require("../../../utils/externalPriceFeeder");

const priceFeedQueueName = "priceFeeder";

const priceFeedQueue = new Queue(priceFeedQueueName, {
  ...redisConnection,
  ...retryMechanism,
});

const priceFeedWorker = new Worker(
  priceFeedQueueName,
  async (job) => {
    const { symbol, interval, timestamp } = job.data;

    job.log(`Getting price for ${(symbol, timestamp)}`);
    const price = await getClosePrice(symbol, timestamp, interval);

    // calculate price in USDT
    const priceInUSDT = price;

    // add new job to persistTxnsQueue

    return priceInUSDT;
  },
  { ...redisConnection, ...rateLimiter }
);

module.exports = {
  priceFeedQueue,
  priceFeedWorker,
};
