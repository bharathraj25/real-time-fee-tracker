const { Queue, Worker } = require("bullmq");
const {
  redisConnection,
  retryMechanism,
  rateLimiter,
  stalledCountOpts,
} = require("../../../common");
const { v4: uuidv4 } = require("uuid");
const { keyBuilder, historyKeyBuilder } = require("../../../redis/keyBuilder");
const { setRedisKey, getRedisKey } = require("../../../redis");
const { getLatestBlockNumber } = require("../../../utils/web3Services");
const { getHistoricalTxnsParentQueue } = require("../getHistoricalTxns");
const {
  getTxnsFromEtherscanQueue,
  getTxnsFromEtherscanQueueEvent,
} = require("../getEtherscanTxns");

const getLiveTxnsQueue = new Queue("getLiveTxns", {
  ...redisConnection,
  ...retryMechanism,
});

const getLiveTxnsWorker = new Worker(
  "getLiveTxns",
  async (job) => {
    let { poolAddress } = job.data;
    const parentJobId = job.id;
    const parentJobName = job.name;
    // setting a key value for name to id mapping
    await setRedisKey(parentJobName, parentJobId);

    let latestBlock = await getLatestBlockNumber();
    job.log(`Latest block number is ${latestBlock}`);
    const lastBlockKey = keyBuilder(poolAddress, "lastBlock");
    let lastBlock = await getRedisKey(lastBlockKey);
    lastBlock = lastBlock ? Number(lastBlock) : 0;
    let diff = latestBlock - lastBlock;

    job.log(`Last block key is ${lastBlockKey}`);

    // check if there is historical data to fetch
    if (diff > 100) {
      let hStartBlock = lastBlock;
      let hEndBlock = latestBlock;
      const historyJobKey = historyKeyBuilder(
        poolAddress,
        hStartBlock,
        hEndBlock
      );
      job.log(`History job key is ${historyJobKey}`);

      await setRedisKey(historyJobKey, hStartBlock);
      await getHistoricalTxnsParentQueue.add(historyJobKey, {
        poolAddress,
        startBlock: hStartBlock,
        endBlock: hEndBlock,
      });
    } else {
      latestBlock = lastBlock;
    }

    let hasMoreData = true;
    let startBlock = latestBlock;

    while (hasMoreData) {
      //await for 20 seconds sort of polling
      await new Promise((resolve) => setTimeout(resolve, 20000));

      const txnJobName = keyBuilder(poolAddress, uuidv4());
      const txnJob = await getTxnsFromEtherscanQueue.add(txnJobName, {
        poolAddress,
        startBlock,
        isLive: true,
      });

      // Wait for the triggered txnjob to complete and get the result
      const txnResult = await txnJob.waitUntilFinished(
        getTxnsFromEtherscanQueueEvent
      );

      job.log(
        `Here are the txns status: ${txnResult.status} - ${txnResult.message}`
      );
      let latestBlock = await getLatestBlockNumber();
      job.updateProgress((Number(startBlock) / latestBlock) * 100);

      if (txnResult.status == "1") {
        startBlock = txnResult.result[txnResult.result.length - 1].blockNumber;
        await setRedisKey(lastBlockKey, Number(startBlock) - 1);
        job.updateProgress((startBlock / latestBlock) * 100);
        job.log(`Here are the txns - ${JSON.stringify(txnResult)}`);
        continue;
      }

      if (txnResult.status == "0") {
        if (txnResult.message == "No transactions found") {
          job.updateProgress(100);
          job.log("No transactions found");
        } else {
          throw new Error(txnResult);
        }
      }
    }
  },
  { ...redisConnection, ...rateLimiter, ...stalledCountOpts }
);

module.exports = {
  getLiveTxnsQueue,
  getLiveTxnsWorker,
};
