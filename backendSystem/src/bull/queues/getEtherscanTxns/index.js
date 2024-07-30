const { Queue, Worker } = require("bullmq");
const etherscanService = require("../../../utils/etherscanService");
const { redisConnection, retryMechanism } = require("..common/common");

const getTxnsFromEtherscanQueue = new Queue("getTxnsFromEtherscan", {
  ...redisConnection,
  ...retryMechanism,
});

const getTxnsFromEtherscanWorker = new Worker(
  "getTxnsFromEtherscan",
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
    job.log(`Here are the txns - ${txns}`);
    done(null, txns);
    return txns;
  },
  redisConnection
);

module.exports = {
  getTxnsFromEtherscanQueue,
  getTxnsFromEtherscanWorker,
};
