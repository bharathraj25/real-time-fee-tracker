const { Queue, Worker, QueueEvents } = require("bullmq");
const etherscanService = require("../../../utils/etherscanService");
const {
  redisConnection,
  retryMechanism,
  rateLimiter,
  stalledCountOpts,
} = require("../../../common");
const { priceFeedQueue } = require("../priceFeeder");

const getTxnsFromEtherscanQueueName = "getTxnsFromEtherscan";

const getTxnsFromEtherscanQueue = new Queue(getTxnsFromEtherscanQueueName, {
  ...redisConnection,
  ...retryMechanism,
});

const getTxnsFromEtherscanWorker = new Worker(
  getTxnsFromEtherscanQueueName,
  async (job) => {
    const { poolAddress, startBlock, endBlock, page, offset, sort, isLive } =
      job.data;
    const jobName = job.name;
    const txnsRes = await etherscanService(
      poolAddress,
      startBlock,
      endBlock,
      page,
      offset,
      sort
    );
    job.log(`Here are the txns - ${page} ${offset}  ${txnsRes}`);

    if (txnsRes.status == "1") {
      job.log(`txns status is 1`);
      const priority = 10;
      const interval = isLive ? "1s" : "1s";

      job.log(`Adding txns to priceFeedQueue`);

      // add new jobs to priceFeedQueue to calculate txn fee in usdt
      const priceFeedJobPrefix = `${jobName}:priceFeed`;
      await priceFeedQueue.addBulk(
        txnsRes.result.map((txn) => ({
          name: `${priceFeedJobPrefix}:${txn.hash}`,
          data: {
            poolAddress,
            symbol: "ETHUSDT",
            interval,
            txnData: txn,
            txnJobName: jobName,
          },
          opts: isLive ? {} : { priority },
        }))
      );
    }

    return txnsRes;
  },
  { ...redisConnection, ...rateLimiter, ...stalledCountOpts }
);

const getTxnsFromEtherscanQueueEvent = new QueueEvents(
  getTxnsFromEtherscanQueueName,
  {
    ...redisConnection,
  }
);

module.exports = {
  getTxnsFromEtherscanQueue,
  getTxnsFromEtherscanWorker,
  getTxnsFromEtherscanQueueEvent,
};
