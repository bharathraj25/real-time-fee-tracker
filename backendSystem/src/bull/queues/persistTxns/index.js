const { Queue, Worker } = require("bullmq");
const {
  redisConnection,
  retryMechanism,
  rateLimiter,
} = require("../../../common");

const persistTxnsQueueName = "persistTxns";

const persistTxnsQueue = new Queue(persistTxnsQueueName, {
  ...redisConnection,
  ...retryMechanism,
});

const persistTxnsWorker = new Worker(persistTxnsQueueName, async (job) => {
  const { txnData, price } = job.data;

  // interact with the database
  // persist txnData and price

  // job done
  return true;
});
