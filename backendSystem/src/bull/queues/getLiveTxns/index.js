const { Queue, Worker } = require("bullmq");
const { redisConnection, retryMechanism } = require("..common/common");
const { v4: uuidv4 } = require("uuid");
const { keyBuilder } = require("../../../redis/keyBuilder");
const { setRedisKey, getRedisKey } = require("../../../redis");
const getLatestBlockNumber = require("../../../utils/getLatestBlockNumber");

const getLiveTxnsQueue = new Queue("getLiveTxns", {
  ...redisConnection,
  ...retryMechanism,
});

const getLiveTxnsWorker = new Worker(
  "getLiveTxns",
  async (job) => {
    let { poolAddress } = job.data;
    let latestBlock = await getLatestBlockNumber();
    const lastBlockKey = keyBuilder(poolAddress, "lastBlock");
    let lastBlock = await getRedisKey(lastBlockKey);
    lastBlock = lastBlock ? Number(lastBlock) : 0;
    let diff = latestBlock - lastBlock;

    // check if there is historical data to fetch
    if (diff > 0) {
      let hStartBlock = lastBlock;
      let hEndBlock = latestBlock;
      const historyJobKey = historyKeyBuilder(
        poolAddress,
        hStartBlock,
        hEndBlock
      );

      await setRedisKey(historyJobKey, hStartBlock);
      getHistoricalTxnsQueue.add(historyJobKey, {
        poolAddress,
        startBlock: hStartBlock,
        endBlock: hEndBlock,
      });
    }

    let hasMoreData = true;
    let startBlock = latestBlock;

    while (hasMoreData) {
      const jobKey = keyBuilder(poolAddress, uuidv4());
      const txns = await getTxnsFromEtherscanQueue.add(
        jobKey,
        {
          poolAddress,
          startBlock,
        },
        { priority: 1, delay: 10000 }
      );
      let latestBlock = await getLatestBlockNumber();
      job.updateProgress((Number(startBlock) / latestBlock) * 100);

      if (txns.status == "1") {
        await setRedisKey(job.id, lastBlock);
        startBlock = txns.result[txns.result.length - 1].blockNumber;
        job.updateProgress((startBlock / latestBlock) * 100);
        job.log(`Here are the txns - ${txns}`);
        continue;
      }

      if (txns.status == "0") {
        if (txns.message == "No transactions found") {
          job.updateProgress(100);
          job.log("No transactions found");
        } else {
          throw new Error(txns);
        }
      }
    }
    console.log(`Job ${job.id} added to queue.`);
  },
  redisConnection
);

module.exports = {
  getLiveTxnsQueue,
  getLiveTxnsWorker,
};
