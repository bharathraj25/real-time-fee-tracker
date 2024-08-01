const { Job, Queue, QueueEvents, Worker } = require("bullmq");
const {
  redisConnection,
  retryMechanism,
  rateLimiter,
  stalledCountOpts,
} = require("../../../common");
const { v4: uuidv4 } = require("uuid");
const { keyBuilder } = require("../../../redis/keyBuilder");
const { setRedisKey, getRedisKey } = require("../../../redis");
const {
  getTxnsFromEtherscanQueue,
  getTxnsFromEtherscanQueueEvent,
} = require("../getEtherscanTxns");
const e = require("express");
const { ETHERSCAN_MAX_WINDOW } = require("../../../config");

const getHistoricalTxnsChildQueueName = "getHistoricalTxnsChild";

const getHistoricalTxnsChildQueue = new Queue(getHistoricalTxnsChildQueueName, {
  ...redisConnection,
  ...retryMechanism,
});

const getHistoricalTxnsChildWorker = new Worker(
  getHistoricalTxnsChildQueueName,
  async (job) => {
    const {
      poolAddress,
      startBlock,
      updatedStartBlock,
      endBlock,
      page,
      offset,
      parentJobId,
      parentJobName,
    } = job.data;

    job.log("Processing historical transactions");

    let hasMoreData = true;

    const txnJobName = keyBuilder(poolAddress, uuidv4());
    const txnJob = await getTxnsFromEtherscanQueue.add(
      txnJobName,
      {
        poolAddress,
        updatedStartBlock,
        endBlock,
        page,
        offset,
      },
      { priority: 10 }
    );

    // Wait for the triggered txnjob to complete and get the result
    const txnResult = await txnJob.waitUntilFinished(
      getTxnsFromEtherscanQueueEvent
    );

    job.log(
      `Txn job ${txnJobName} with status ${txnResult.status} and message ${txnResult.message}`
    );

    //await for 60 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000));

    if (txnResult.status == "0") {
      if (txnResult.message == "No transactions found") {
        hasMoreData = false;
      } else {
        throw new Error(txnResult.message);
      }
    }

    const parentJob = await Job.fromId(
      getHistoricalTxnsParentQueue,
      parentJobId
    );
    const lastBlock = txnResult.result[txnResult.result.length - 1].blockNumber;
    if (parentJob) {
      const totalBlocks = Number(endBlock) - Number(startBlock);
      const completionPercentage =
        ((Number(lastBlock) - Number(startBlock)) / totalBlocks) * 100;
      job.log(`Completion percentage is ${completionPercentage}`);
      parentJob.updateProgress(completionPercentage);
    }

    await setRedisKey(`${parentJobName}:lastChildId`, job.id);

    if (hasMoreData) {
      const nextPage = page + 1;
      let maxWindowmReached = false;
      txnResult.result[txnResult.result.length - 1].blockNumber;
      if (nextPage * offset >= ETHERSCAN_MAX_WINDOW) {
        job.log(`Reached the maximum window size of ${ETHERSCAN_MAX_WINDOW}`);
        maxWindowmReached = true;
      }
      const childJobName = `${parentJobName}:child:${uuidv4()}`;
      await getHistoricalTxnsChildQueue.add(childJobName, {
        ...job.data,
        page: maxWindowmReached ? 1 : nextPage,
        updatedStartBlock: maxWindowmReached ? lastBlock : updatedStartBlock,
      });
    } else {
      await parentJob.updateProgress({ completed: true });
      await parentJob.moveToCompleted("done", true);
    }
  },
  { ...redisConnection, ...rateLimiter, ...stalledCountOpts }
);

const getHistoricalTxnsParentQueueName = "getHistoricalTxnsParent";

const getHistoricalTxnsParentQueue = new Queue(
  getHistoricalTxnsParentQueueName,
  {
    ...redisConnection,
    ...retryMechanism,
  }
);

const getHistoricalTxnsParentWorker = new Worker(
  getHistoricalTxnsParentQueueName,
  async (job) => {
    let { poolAddress, startBlock, endBlock } = job.data;

    job.log(
      `Processing historical transactions for ${poolAddress}, ${startBlock}, ${endBlock}`
    );
    const parentJobId = job.id;
    const parentJobName = job.name;
    // setting a key value for name to id mapping
    await setRedisKey(parentJobName, parentJobId);
    job.log(`Parent job id is ${parentJobId}`);

    // Check if the first page job has already been triggered
    const childTriggerStateKey = `${parentJobName}:childTriggerStatus`;
    const triggered = await getRedisKey(childTriggerStateKey);
    job.log(`Child trigger status is ${triggered}`);

    if (!triggered) {
      job.log(`Triggering child job`);
      let page = 1;
      const offset = 1500;

      const childJobName = `${parentJobName}:child:${uuidv4()}`;
      // Start processing the first page
      await getHistoricalTxnsChildQueue.add(childJobName, {
        poolAddress,
        startBlock,
        updatedStartBlock: startBlock,
        endBlock,
        page,
        offset,
        parentJobId,
        parentJobName,
      });

      await setRedisKey(childTriggerStateKey, "true");
    }

    // Keep the parent job running until manually completed
    return null; // Return null to avoid keeping the parent job open indefinitely
  },
  { ...redisConnection, ...rateLimiter }
);

module.exports = {
  getHistoricalTxnsParentQueue,
  getHistoricalTxnsParentWorker,
  getHistoricalTxnsChildQueue,
  getHistoricalTxnsChildWorker,
};
