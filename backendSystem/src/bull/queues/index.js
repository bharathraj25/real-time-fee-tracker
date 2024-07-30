const {
  getHistoricalTxnsQueue,
  getHistoricalTxnsWorker,
} = require("./getHistoricalTxns");
const {
  getTxnsFromEtherscanQueue,
  getTxnsFromEtherscanWorker,
} = require("./getEtherscanTxns");
const { getLiveTxnsQueue, getLiveTxnsWorker } = require("./getLiveTxns");

module.exports = {
  getHistoricalTxnsQueue,
  getHistoricalTxnsWorker,
  getTxnsFromEtherscanQueue,
  getTxnsFromEtherscanWorker,
  getLiveTxnsQueue,
  getLiveTxnsWorker,
};
