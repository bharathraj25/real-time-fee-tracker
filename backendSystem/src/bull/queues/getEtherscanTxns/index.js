const { Queue, Worker, QueueEvents } = require("bullmq");
const etherscanService = require("../../../utils/etherscanService");
const { redisConnection, retryMechanism, rateLimiter } = require("../common");

const getTxnsFromEtherscanQueueName = "getTxnsFromEtherscan";

const getTxnsFromEtherscanQueue = new Queue(getTxnsFromEtherscanQueueName, {
  ...redisConnection,
  ...retryMechanism,
});

const getTxnsFromEtherscanWorker = new Worker(
  getTxnsFromEtherscanQueueName,
  async (job) => {
    const { poolAddress, startBlock, endBlock, page, offset, sort } = job.data;

    const txns = await etherscanService(
      poolAddress,
      startBlock,
      endBlock,
      page,
      offset,
      sort
    );
    job.log(`Here are the txns - ${page} ${offset}  ${txns}`);
    return txns;
  },
  { ...redisConnection, ...rateLimiter }
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
