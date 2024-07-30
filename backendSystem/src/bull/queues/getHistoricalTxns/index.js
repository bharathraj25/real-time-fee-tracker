const { redisConnection, retryMechanism } = require("..common/common");

const getHistoricalTxnsQueue = new Queue("getHistoricalTxns", {
  ...redisConnection,
  ...retryMechanism,
});

const getHistoricalTxnsWorker = new Worker(
  "getHistoricalTxns",
  async (job) => {
    let { poolAddress, startBlock, endBlock } = job.data;
    let lastBlock = await getRedisKey(job.id);
    startBlock = lastBlock ? lastBlock : startBlock;

    let page = 1;
    const offset = 100;

    let hasMoreData = true;

    while (hasMoreData) {
      const jobKey = keyBuilder(poolAddress, uuidv4());
      const txns = await getTxnsFromEtherscanQueue.add(
        jobKey,
        {
          poolAddress,
          startBlock,
          endBlock,
          page,
          offset,
        },
        { priority: 10 }
      );

      if (txns.status == "0") {
        if (txns.message == "No transactions found") {
          hasMoreData = false;
        } else {
          throw new Error(txns);
        }
      }

      const lastBlock = txns.result[txns.result.length - 1].blockNumber;
      await setRedisKey(job.id, lastBlock);

      const totalBlocks = Number(endBlock) - Number(startBlock);
      const completionPercentage =
        (Number(lastBlock) - Number(startBlock) / totalBlocks) * 100;
      job.updateProgress(completionPercentage);

      page += 1;
    }
    console.log(`Job ${job.id} added to queue.`);
  },
  redisConnection
);

module.exports = {
  getHistoricalTxnsQueue,
  getHistoricalTxnsWorker,
};
